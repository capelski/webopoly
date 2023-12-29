import React from 'react';
import { GameEventType } from '../enums';
import {
  getChanceCardById,
  getCommunityChestCardById,
  getPlayerById,
  getSquareById,
} from '../logic';
import {
  chanceSymbol,
  communityChestSymbol,
  currencySymbol,
  diceSymbol,
  goSymbol,
  goToJailSymbol,
  jailSymbol,
  mortgageSymbol,
  parkingSymbol,
  passGoMoney,
  taxSymbol,
} from '../parameters';
import { Game, GameEvent, Player, TypedGameEvent } from '../types';

interface GameEventComponentProps {
  event: GameEvent;
  game: Game;
}

const gameEventTypeMap: { [key in GameEventType]: string } = {
  [GameEventType.bankruptcy]: '🧨',
  [GameEventType.buyProperty]: '💵',
  [GameEventType.chance]: chanceSymbol,
  [GameEventType.clearMortgage]: '❎',
  [GameEventType.communityChest]: communityChestSymbol,
  [GameEventType.freeParking]: parkingSymbol,
  [GameEventType.getOutOfJail]: '🎉',
  [GameEventType.goToJail]: goToJailSymbol,
  [GameEventType.mortgage]: mortgageSymbol,
  [GameEventType.passGo]: goSymbol,
  [GameEventType.payRent]: '🚀',
  [GameEventType.payTax]: taxSymbol,
  [GameEventType.playerWin]: '🏆',
  [GameEventType.remainInJail]: jailSymbol,
  [GameEventType.rollDice]: diceSymbol,
};

const descriptionsMap: {
  [TKey in GameEventType]: (
    player: Player,
    event: TypedGameEvent<TKey>,
    game: Game,
  ) => React.ReactNode;
} = {
  [GameEventType.bankruptcy]: (player) => `${player.name} goes bankrupt`,
  [GameEventType.buyProperty]: (player, event, game) => {
    const square = getSquareById(game, event.squareId);
    return `${player.name} buys ${square.name}`;
  },
  [GameEventType.chance]: (player, event) => (
    <React.Fragment>
      <span>{player.name} takes out a Chance card:</span>
      <div>{getChanceCardById(event.cardId).text}</div>
    </React.Fragment>
  ),
  [GameEventType.clearMortgage]: (player, event, game) => {
    const square = getSquareById(game, event.squareId);
    return `${player.name} clears the mortgage on ${square.name}`;
  },
  [GameEventType.communityChest]: (player, event) => (
    <React.Fragment>
      <span>{player.name} takes out a Community Chest card:</span>
      <div>{getCommunityChestCardById(event.cardId).text}</div>
    </React.Fragment>
  ),
  [GameEventType.freeParking]: (player, event) =>
    `${player.name} collects ${currencySymbol}${event.pot} from Free Parking`,
  [GameEventType.getOutOfJail]: (player, event, game) => {
    const square = getSquareById(game, event.squareId);
    return `${player.name} rolls ${event.dice}, gets out of jail and lands in ${square.name}`;
  },
  [GameEventType.goToJail]: (player) => `${player.name} goes to jail for 3 turns`,
  [GameEventType.passGo]: (player) =>
    `${player.name} passes GO and gets ${currencySymbol}${passGoMoney}`,
  [GameEventType.mortgage]: (player, event, game) => {
    const square = getSquareById(game, event.squareId);
    return `${player.name} mortgages ${square.name}`;
  },
  [GameEventType.payRent]: (player, event, game) => {
    const landlord = getPlayerById(game, event.landlordId)!;
    return `${player.name} pays ${currencySymbol}${event.rent} rent to ${landlord.name}`;
  },
  [GameEventType.payTax]: (player, event) =>
    `${player.name} pays ${currencySymbol}${event.tax} in taxes`,
  [GameEventType.playerWin]: (player) => `${player.name} wins the game`,
  [GameEventType.remainInJail]: (player, event) =>
    `${player.name} remains in jail for ${
      event.turnsInJail === 0 ? 'the last turn' : `${event.turnsInJail} more turn(s)`
    }`,
  [GameEventType.rollDice]: (player, event, game) => {
    const square = getSquareById(game, event.squareId);
    return `${player.name} rolls ${event.dice} and lands in ${square.name}`;
  },
};

// TODO Split component into Modal/Toast events

export const GameEventComponent: React.FC<GameEventComponentProps> = (props) => {
  return (
    <div>
      <span>{gameEventTypeMap[props.event.type]}</span>
      <span style={{ paddingLeft: 8 }}>
        {descriptionsMap[props.event.type](
          getPlayerById(props.game, props.event.playerId),
          props.event as any,
          props.game,
        )}
      </span>
    </div>
  );
};
