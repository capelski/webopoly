import { NotificationSource, NotificationType, PropertyType } from '../enums';
import { currencySymbol, passGoMoney } from '../parameters';
import {
  triggerExpense,
  triggerGetOutOfJailCard,
  triggerGoToJail,
  triggerMovePlayer,
  triggerPayStreetRepairs,
  triggerPayToAllPlayers,
  triggerReceivePayout,
} from '../triggers';
import { Card } from '../types';
import { getNextPropertyOfTypeId, getNextSquareId } from './game';
import { squaresMap } from './minification/squares-map';

export const chanceCards: Card[] = [
  {
    action: (game) => {
      return triggerMovePlayer(game, 1);
    },
    id: 1,
    text: `Advance to ${squaresMap[1].name}`,
  },
  {
    action: (game) => {
      return triggerMovePlayer(game, 25);
    },
    id: 2,
    text: `Advance to ${squaresMap[25].name}`,
  },
  {
    action: (game) => {
      return triggerMovePlayer(game, 40);
    },
    id: 3,
    text: `Advance to ${squaresMap[40].name}`,
  },
  {
    action: (game) => {
      return triggerMovePlayer(game, 12);
    },
    id: 4,
    text: `Advance to ${squaresMap[12].name}`,
  },
  {
    action: (game) => {
      const nextStationId = getNextPropertyOfTypeId(game, PropertyType.station);
      return triggerMovePlayer(game, nextStationId);
    },
    id: 5,
    text: 'Advance to the next Station',
  },
  {
    action: (game) => {
      const nextStationId = getNextPropertyOfTypeId(game, PropertyType.station);
      return triggerMovePlayer(game, nextStationId);
    },
    id: 6,
    text: 'Advance to the next Station',
  },
  {
    action: (game) => {
      const nextUtilityId = getNextPropertyOfTypeId(game, PropertyType.utility);
      return triggerMovePlayer(game, nextUtilityId);
    },
    id: 7,
    text: 'Advance to the next Utility',
  },
  {
    action: (game) => {
      return triggerReceivePayout(game, 50);
    },
    id: 8,
    text: `Bank pays you dividend of ${currencySymbol}50`,
  },
  {
    action: triggerGetOutOfJailCard,
    id: 9,
    text: 'Get Out of Jail Free',
  },
  {
    action: (game) => {
      const nextSquareId = getNextSquareId(game, -3);
      return triggerMovePlayer(game, nextSquareId, { preventPassGo: true });
    },
    id: 10,
    text: 'Go Back 3 Spaces',
  },
  {
    action: (game) => {
      return triggerGoToJail(game, NotificationSource.chanceCard);
    },
    id: 11,
    skipNotification: true,
    text: `Go to Jail. If you pass Go, do not collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return triggerPayStreetRepairs(game, 25);
    },
    id: 12,
    text: `Make general repairs on all your property: pay ${currencySymbol}25 for each house`,
  },
  {
    action: (game) => {
      return triggerExpense(game, {
        amount: 15,
        cardId: 13,
        playerId: game.currentPlayerId,
        source: NotificationSource.chanceCard,
        type: NotificationType.expense,
      });
    },
    id: 13,
    skipNotification: true,
    text: `Speeding fine ${currencySymbol}15`,
  },
  {
    action: (game) => {
      return triggerMovePlayer(game, 6);
    },
    id: 14,
    text: `Take a trip to ${squaresMap[6].name}`,
  },
  {
    action: (game) => {
      return triggerPayToAllPlayers(game, 50);
    },
    id: 15,
    text: `You have been elected Chairman of the Board. Pay each player ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return triggerReceivePayout(game, 150);
    },
    id: 16,
    text: `Your building loan matures. Collect ${currencySymbol}150`,
  },
];

export const getChanceCardById = (id: number): Card => {
  return chanceCards.find((card) => card.id === id)!;
};
