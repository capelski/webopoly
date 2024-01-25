import { PropertyType } from '../enums';
import { currencySymbol, passGoMoney } from '../parameters';
import { triggerMovePlayer } from '../triggers';
import { Card } from '../types';
import { shuffleArray } from './array';
import {
  getNextPropertyOfTypeId,
  getNextSquareId,
  payFee,
  payStreetRepairs,
  payToAllPlayers,
  receivePayout,
} from './game';
import { squaresMap } from './game-minified/squares-map';
import { goToJail } from './player';

const chanceSource: Omit<Card, 'id'>[] = [
  {
    action: (game) => {
      return triggerMovePlayer(game, 1);
    },
    text: `Advance to ${squaresMap[1].name}`,
  },
  {
    action: (game) => {
      return triggerMovePlayer(game, 25);
    },
    text: `Advance to ${squaresMap[25].name}`,
  },
  {
    action: (game) => {
      return triggerMovePlayer(game, 40);
    },
    text: `Advance to ${squaresMap[40].name}`,
  },
  {
    action: (game) => {
      return triggerMovePlayer(game, 12);
    },
    text: `Advance to ${squaresMap[12].name}`,
  },
  {
    action: (game) => {
      const nextStationId = getNextPropertyOfTypeId(game, PropertyType.station);
      return triggerMovePlayer(game, nextStationId);
    },
    text: 'Advance to the next Station',
  },
  {
    action: (game) => {
      const nextStationId = getNextPropertyOfTypeId(game, PropertyType.station);
      return triggerMovePlayer(game, nextStationId);
    },
    text: 'Advance to the next Station',
  },
  {
    action: (game) => {
      const nextUtilityId = getNextPropertyOfTypeId(game, PropertyType.utility);
      return triggerMovePlayer(game, nextUtilityId);
    },
    text: 'Advance to the next Utility',
  },
  {
    action: (game) => {
      return receivePayout(game, 50);
    },
    text: `Bank pays you dividend of ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return {
        ...game,
        players: game.players.map((p) => {
          return p.id === game.currentPlayerId ? { ...p, getOutOfJail: p.getOutOfJail + 1 } : p;
        }),
      };
    },
    text: 'Get Out of Jail Free',
  },
  {
    action: (game) => {
      const nextSquareId = getNextSquareId(game, -3);
      return triggerMovePlayer(game, nextSquareId, { preventPassGo: true });
    },
    text: 'Go Back 3 Spaces',
  },
  {
    action: goToJail,
    text: `Go to Jail. If you pass Go, do not collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return payStreetRepairs(game, 25);
    },
    text: `Make general repairs on all your property: pay ${currencySymbol}25 for each house`,
  },
  {
    action: (game) => {
      return payFee(game, 15);
    },
    text: `Speeding fine ${currencySymbol}15`,
  },
  {
    action: (game) => {
      return triggerMovePlayer(game, 6);
    },
    text: `Take a trip to ${squaresMap[6].name}`,
  },
  {
    action: (game) => {
      return payToAllPlayers(game, 50);
    },
    text: `You have been elected Chairman of the Board. Pay each player ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return receivePayout(game, 150);
    },
    text: `Your building loan matures. Collect ${currencySymbol}150`,
  },
];

const chanceCards: Card[] = chanceSource.map((card, index) => ({
  ...card,
  id: index + 1,
}));

let availableIds: number[] = [];

export const getChanceCardById = (id: number): Card => {
  return chanceCards.find((card) => card.id === id)!;
};

export const getNextChanceCardId = (): number => {
  if (availableIds.length === 0) {
    availableIds = shuffleArray(chanceCards.map((card) => card.id));
  }
  const nextId = availableIds.shift()!;
  return nextId;
};
