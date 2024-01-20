import React from 'react';
import { AnswerType, ChangeType, OfferType } from '../enums';
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
  goSymbol,
  goToJailSymbol,
  houseSymbol,
  jailSymbol,
  mortgageSymbol,
  parkingSymbol,
  passGoMoney,
  taxSymbol,
} from '../parameters';
import { Change, Game, Player } from '../types';

type Renderer<T = ChangeType> = (
  player: Player,
  change: Change & { type: T },
  game: Game,
) => {
  description: string;
  icon: string;
};

const renderersMap: {
  [TKey in ChangeType]: false | Renderer<TKey>;
} = {
  [ChangeType.answerOffer]: (player, change, game) => {
    const square = getSquareById(game, change.propertyId);
    const owner = getPlayerById(game, change.targetPlayerId);
    const acceptsOffer = change.answer === AnswerType.accept;
    const isBuyingOffer = change.offerType === OfferType.buy;
    return {
      description: `${player.name} ${acceptsOffer ? 'accepts' : 'declines'} ${currencySymbol}${
        change.amount
      } ${isBuyingOffer ? 'BUY' : 'SELL'} offer for ${square.name} from ${owner.name}`,
      icon: change.answer === AnswerType.accept ? '👍' : '👎',
    };
  },
  [ChangeType.bankruptcy]: (player) => ({
    description: `${player.name} goes bankrupt`,
    icon: '🧨',
  }),
  [ChangeType.buildHouse]: (player, change, game) => {
    const square = getSquareById(game, change.propertyId);
    return {
      description: `${player.name} builds a house in ${square.name}`,
      icon: houseSymbol,
    };
  },
  [ChangeType.buyProperty]: (player, change, game) => {
    const square = getSquareById(game, change.propertyId);
    return {
      description: `${player.name} buys ${square.name}`,
      icon: '💵',
    };
  },
  [ChangeType.chance]: (player, change) => ({
    description: `${player.name}: ${getChanceCardById(change.cardId).text}`,
    icon: chanceSymbol,
  }),
  [ChangeType.clearMortgage]: (player, change, game) => {
    const square = getSquareById(game, change.propertyId);
    return {
      description: `${player.name} clears the mortgage on ${square.name}`,
      icon: '❎',
    };
  },
  [ChangeType.communityChest]: (player, change) => ({
    description: `${player.name}: ${getCommunityChestCardById(change.cardId).text}`,
    icon: communityChestSymbol,
  }),
  [ChangeType.endTurn]: false,
  [ChangeType.freeParking]: (player, change) => ({
    description: `${player.name} collects ${currencySymbol}${change.pot} from Free Parking`,
    icon: parkingSymbol,
  }),
  [ChangeType.getOutOfJail]: (player, _change, game) => ({
    description: `${player.name} rolls ${game.dice.join('-')} and gets out of jail`,
    icon: '🎉',
  }),
  [ChangeType.goToJail]: (player) => ({
    description: `${player.name} goes to jail for 3 turns`,
    icon: goToJailSymbol,
  }),
  [ChangeType.mortgage]: (player, change, game) => {
    const square = getSquareById(game, change.propertyId);
    return {
      description: `${player.name} mortgages ${square.name}`,
      icon: mortgageSymbol,
    };
  },
  [ChangeType.passGo]: (player) => ({
    description: `${player.name} passes GO and gets ${currencySymbol}${passGoMoney}`,
    icon: goSymbol,
  }),
  [ChangeType.payRent]: (player, change, game) => {
    const landlord = getPlayerById(game, change.landlordId)!;
    return {
      description: `${player.name} pays ${currencySymbol}${change.rent} rent to ${landlord.name}`,
      icon: '🚀',
    };
  },
  [ChangeType.payTax]: (player, change) => ({
    description: `${player.name} pays ${currencySymbol}${change.tax} in taxes`,
    icon: taxSymbol,
  }),
  [ChangeType.playerWin]: false,
  [ChangeType.placeOffer]: (player, change, game) => {
    const square = getSquareById(game, change.propertyId);
    const owner = getPlayerById(game, change.targetPlayerId);
    const isBuyingOffer = change.offerType === OfferType.buy;
    return {
      description: `${player.name} places ${currencySymbol}${change.amount} ${
        isBuyingOffer ? 'BUY' : 'SELL'
      } offer for ${square.name} to ${owner.name}`,
      icon: isBuyingOffer ? '⬅️' : '➡️',
    };
  },
  [ChangeType.remainInJail]: (player, change) => ({
    description: `${player.name} remains in jail for ${
      change.turnsInJail === 0 ? 'the last turn' : `${change.turnsInJail} more turn(s)`
    }`,
    icon: jailSymbol,
  }),
  [ChangeType.rollDice]: false,
  [ChangeType.sellHouse]: (player, change, game) => {
    const square = getSquareById(game, change.propertyId);
    return {
      description: `${player.name} sells a house in ${square.name}`,
      icon: '🏚️',
    };
  },
};

interface ChangeComponentProps {
  change: Change;
  game: Game;
}

export const ChangeComponent: React.FC<ChangeComponentProps> = (props) => {
  const renderer = renderersMap[props.change.type] as Renderer;

  if (!renderer) {
    return undefined;
  }

  const player = getPlayerById(props.game, props.change.playerId);
  const { description, icon } = renderer(player, props.change, props.game);

  return (
    <div>
      <span>{icon}</span>
      <span style={{ paddingLeft: 8 }}>{description}</span>
    </div>
  );
};
