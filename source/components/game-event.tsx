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
  goSymbol,
  goToJailSymbol,
  houseSymbol,
  jailSymbol,
  mortgageSymbol,
  parkingSymbol,
  passGoMoney,
  taxSymbol,
} from '../parameters';
import { Game, GameEvent, Player } from '../types';

type Descriptor<T = GameEventType> = (
  player: Player,
  event: GameEvent & { type: T },
  game: Game,
) => string | false;

const renderersMap: {
  [TKey in GameEventType]:
    | false
    | {
        description: Descriptor<TKey>;
        icon: string;
      };
} = {
  [GameEventType.bankruptcy]: {
    description: (player) => `${player.name} goes bankrupt`,
    icon: '🧨',
  },
  [GameEventType.buildHouse]: {
    description: (player, event, game) => {
      const square = getSquareById(game, event.propertyId);
      return `${player.name} builds a house in ${square.name}`;
    },
    icon: houseSymbol,
  },
  [GameEventType.buyProperty]: {
    description: (player, event, game) => {
      const square = getSquareById(game, event.propertyId);
      return `${player.name} buys ${square.name}`;
    },
    icon: '💵',
  },
  [GameEventType.chance]: {
    description: (player, event) => `${player.name}: ${getChanceCardById(event.cardId).text}`,
    icon: chanceSymbol,
  },
  [GameEventType.clearMortgage]: {
    description: (player, event, game) => {
      const square = getSquareById(game, event.propertyId);
      return `${player.name} clears the mortgage on ${square.name}`;
    },
    icon: '❎',
  },
  [GameEventType.communityChest]: {
    description: (player, event) =>
      `${player.name}: ${getCommunityChestCardById(event.cardId).text}`,
    icon: communityChestSymbol,
  },
  [GameEventType.endTurn]: false,
  [GameEventType.freeParking]: {
    description: (player, event) =>
      `${player.name} collects ${currencySymbol}${event.pot} from Free Parking`,
    icon: parkingSymbol,
  },
  [GameEventType.getOutOfJail]: {
    description: (player, _event, game) => {
      return `${player.name} rolls ${game.dice.join('-')} and gets out of jail`;
    },
    icon: '🎉',
  },
  [GameEventType.goToJail]: {
    description: (player) => `${player.name} goes to jail for 3 turns`,
    icon: goToJailSymbol,
  },
  [GameEventType.mortgage]: {
    description: (player, event, game) => {
      const square = getSquareById(game, event.propertyId);
      return `${player.name} mortgages ${square.name}`;
    },
    icon: mortgageSymbol,
  },
  [GameEventType.passGo]: {
    description: (player) => `${player.name} passes GO and gets ${currencySymbol}${passGoMoney}`,
    icon: goSymbol,
  },
  [GameEventType.payRent]: {
    description: (player, event, game) => {
      const landlord = getPlayerById(game, event.landlordId)!;
      return `${player.name} pays ${currencySymbol}${event.rent} rent to ${landlord.name}`;
    },
    icon: '🚀',
  },
  [GameEventType.payTax]: {
    description: (player, event) => `${player.name} pays ${currencySymbol}${event.tax} in taxes`,
    icon: taxSymbol,
  },
  [GameEventType.playerWin]: {
    description: (player) => `${player.name} wins the game`,
    icon: '🏆',
  },
  [GameEventType.remainInJail]: {
    description: (player, event) =>
      `${player.name} remains in jail for ${
        event.turnsInJail === 0 ? 'the last turn' : `${event.turnsInJail} more turn(s)`
      }`,
    icon: jailSymbol,
  },
  [GameEventType.rollDice]: false,
  [GameEventType.sellHouse]: {
    description: (player, event, game) => {
      const square = getSquareById(game, event.propertyId);
      return `${player.name} sells a house in ${square.name}`;
    },
    icon: '🏚️',
  },
};

interface GameEventComponentProps {
  event: GameEvent;
  game: Game;
}

export const GameEventComponent: React.FC<GameEventComponentProps> = (props) => {
  const renderer = renderersMap[props.event.type];

  if (!renderer) {
    return undefined;
  }

  const player = getPlayerById(props.game, props.event.playerId);
  const descriptor: Descriptor = renderer.description;
  const description = descriptor(player, props.event, props.game);

  return (
    <div>
      <span>{renderer.icon}</span>
      <span style={{ paddingLeft: 8 }}>{description}</span>
    </div>
  );
};
