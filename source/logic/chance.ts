import { PropertyType } from '../enums';
import { currencySymbol, passGoMoney } from '../parameters';
import {
  triggerGetOutOfJailCard,
  triggerGoToJail,
  triggerMovePlayer,
  triggerPayFee,
  triggerPayStreetRepairs,
  triggerPayToAllPlayers,
  triggerReceivePayout,
} from '../triggers';
import { Card } from '../types';
import { getNextPropertyOfTypeId, getNextSquareId } from './game';
import { squaresMap } from './minification/squares-map';

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
      return triggerReceivePayout(game, 50);
    },
    text: `Bank pays you dividend of ${currencySymbol}50`,
  },
  {
    action: triggerGetOutOfJailCard,
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
    action: (game) => {
      return triggerGoToJail(game, { skipPastNotification: true });
    },
    text: `Go to Jail. If you pass Go, do not collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return triggerPayStreetRepairs(game, 25);
    },
    text: `Make general repairs on all your property: pay ${currencySymbol}25 for each house`,
  },
  {
    action: (game) => {
      return triggerPayFee(game, 15);
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
      return triggerPayToAllPlayers(game, 50);
    },
    text: `You have been elected Chairman of the Board. Pay each player ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return triggerReceivePayout(game, 150);
    },
    text: `Your building loan matures. Collect ${currencySymbol}150`,
  },
];

export const chanceCards: Card[] = chanceSource.map((card, index) => ({
  ...card,
  id: index + 1,
}));

export const getChanceCardById = (id: number): Card => {
  return chanceCards.find((card) => card.id === id)!;
};
