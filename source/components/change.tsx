import React from 'react';
import { ChangeType } from '../enums';
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

type Descriptor<T = ChangeType> = (
  player: Player,
  change: Change & { type: T },
  game: Game,
) => string | false;

const renderersMap: {
  [TKey in ChangeType]:
    | false
    | {
        description: Descriptor<TKey>;
        icon: string;
      };
} = {
  [ChangeType.bankruptcy]: {
    description: (player) => `${player.name} goes bankrupt`,
    icon: '🧨',
  },
  [ChangeType.buildHouse]: {
    description: (player, change, game) => {
      const square = getSquareById(game, change.propertyId);
      return `${player.name} builds a house in ${square.name}`;
    },
    icon: houseSymbol,
  },
  [ChangeType.buyProperty]: {
    description: (player, change, game) => {
      const square = getSquareById(game, change.propertyId);
      return `${player.name} buys ${square.name}`;
    },
    icon: '💵',
  },
  [ChangeType.chance]: {
    description: (player, change) => `${player.name}: ${getChanceCardById(change.cardId).text}`,
    icon: chanceSymbol,
  },
  [ChangeType.clearMortgage]: {
    description: (player, change, game) => {
      const square = getSquareById(game, change.propertyId);
      return `${player.name} clears the mortgage on ${square.name}`;
    },
    icon: '❎',
  },
  [ChangeType.communityChest]: {
    description: (player, change) =>
      `${player.name}: ${getCommunityChestCardById(change.cardId).text}`,
    icon: communityChestSymbol,
  },
  [ChangeType.endTurn]: false,
  [ChangeType.freeParking]: {
    description: (player, change) =>
      `${player.name} collects ${currencySymbol}${change.pot} from Free Parking`,
    icon: parkingSymbol,
  },
  [ChangeType.getOutOfJail]: {
    description: (player, _change, game) => {
      return `${player.name} rolls ${game.dice.join('-')} and gets out of jail`;
    },
    icon: '🎉',
  },
  [ChangeType.goToJail]: {
    description: (player) => `${player.name} goes to jail for 3 turns`,
    icon: goToJailSymbol,
  },
  [ChangeType.mortgage]: {
    description: (player, change, game) => {
      const square = getSquareById(game, change.propertyId);
      return `${player.name} mortgages ${square.name}`;
    },
    icon: mortgageSymbol,
  },
  [ChangeType.passGo]: {
    description: (player) => `${player.name} passes GO and gets ${currencySymbol}${passGoMoney}`,
    icon: goSymbol,
  },
  [ChangeType.payRent]: {
    description: (player, change, game) => {
      const landlord = getPlayerById(game, change.landlordId)!;
      return `${player.name} pays ${currencySymbol}${change.rent} rent to ${landlord.name}`;
    },
    icon: '🚀',
  },
  [ChangeType.payTax]: {
    description: (player, change) => `${player.name} pays ${currencySymbol}${change.tax} in taxes`,
    icon: taxSymbol,
  },
  [ChangeType.playerWin]: {
    description: (player) => `${player.name} wins the game`,
    icon: '🏆',
  },
  [ChangeType.remainInJail]: {
    description: (player, change) =>
      `${player.name} remains in jail for ${
        change.turnsInJail === 0 ? 'the last turn' : `${change.turnsInJail} more turn(s)`
      }`,
    icon: jailSymbol,
  },
  [ChangeType.rollDice]: false,
  [ChangeType.sellHouse]: {
    description: (player, change, game) => {
      const square = getSquareById(game, change.propertyId);
      return `${player.name} sells a house in ${square.name}`;
    },
    icon: '🏚️',
  },
};

interface ChangeComponentProps {
  change: Change;
  game: Game;
}

export const ChangeComponent: React.FC<ChangeComponentProps> = (props) => {
  const renderer = renderersMap[props.change.type];

  if (!renderer) {
    return undefined;
  }

  const player = getPlayerById(props.game, props.change.playerId);
  const descriptor: Descriptor = renderer.description;
  const description = descriptor(player, props.change, props.game);

  return (
    <div>
      <span>{renderer.icon}</span>
      <span style={{ paddingLeft: 8 }}>{description}</span>
    </div>
  );
};
