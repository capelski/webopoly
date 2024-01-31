import { EventSource, EventType } from '../enums';
import { currencySymbol, passGoMoney } from '../parameters';
import {
  triggerExpense,
  triggerGetOutOfJailCard,
  triggerGoToJail,
  triggerMovePlayer,
  triggerRepairsExpense,
  triggerWindfall,
} from '../triggers';
import { Card } from '../types';
import { squaresMap } from './minification/squares-map';

export const communityChestCards: Card[] = [
  {
    action: (game) => {
      return triggerMovePlayer(game, 1);
    },
    id: 1,
    text: `Advance to ${squaresMap[1].name}`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 200);
    },
    id: 2,
    text: `Bank error in your favour. Collect ${currencySymbol}200`,
  },
  {
    action: (game) => {
      return triggerExpense(game, {
        amount: 50,
        cardId: 3,
        playerId: game.currentPlayerId,
        source: EventSource.communityChestCard,
        type: EventType.expense,
      });
    },
    id: 3,
    skipNotification: true,
    text: `Doctor's fee. Pay ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 50);
    },
    id: 4,
    text: `From sale of stock you get ${currencySymbol}50`,
  },
  {
    action: triggerGetOutOfJailCard,
    id: 5,
    text: 'Get Out of Jail Free',
  },
  {
    action: (game) => {
      return triggerGoToJail(game, EventSource.communityChestCard);
    },
    id: 6,
    skipNotification: true,
    text: `Go to Jail. If you pass Go, do not collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 100);
    },
    id: 7,
    text: `Holiday fund matures. Receive ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 20);
    },
    id: 8,
    text: `Income tax refund. Collect ${currencySymbol}20`,
  },
  // {
  //   action: (game) => {
  //     return triggerReceiveFromAllPlayers(game, 10);
  //   },
  //   id: 9,
  //   text: `It is your birthday. Collect ${currencySymbol}10 from every player`,
  // },
  {
    action: (game) => {
      return triggerWindfall(game, 100);
    },
    id: 10,
    text: `Life insurance matures. Collect ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return triggerExpense(game, {
        amount: 100,
        cardId: 11,
        playerId: game.currentPlayerId,
        source: EventSource.communityChestCard,
        type: EventType.expense,
      });
    },
    id: 11,
    skipNotification: true,
    text: `Pay hospital fees of ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return triggerExpense(game, {
        amount: 50,
        cardId: 12,
        playerId: game.currentPlayerId,
        source: EventSource.communityChestCard,
        type: EventType.expense,
      });
    },
    id: 12,
    skipNotification: true,
    text: `Pay school fees of ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 25);
    },
    id: 13,
    text: `Receive ${currencySymbol}25 consultancy fee`,
  },
  {
    action: (game) => {
      return triggerRepairsExpense(game, 40, {
        cardId: 14,
        playerId: game.currentPlayerId,
        source: EventSource.communityChestCard,
        type: EventType.expense,
      });
    },
    id: 14,
    skipNotification: true,
    text: `You are assessed for street repairs. ${currencySymbol}40 per house`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 10);
    },
    id: 15,
    text: `You have won second prize in a beauty contest. Collect ${currencySymbol}10`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 100);
    },
    id: 16,
    text: `You inherit ${currencySymbol}100`,
  },
];

export const getCommunityChestCardById = (id: number): Card => {
  return communityChestCards.find((card) => card.id === id)!;
};
