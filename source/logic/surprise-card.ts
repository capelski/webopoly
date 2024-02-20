import { EventSource, EventType, PropertyType } from '../enums';
import { currencySymbol, passGoMoney } from '../parameters';
import {
  triggerExpense,
  triggerGetOutOfJailCard,
  triggerGoToJail,
  triggerMovePlayer,
  triggerRepairsExpense,
  triggerWindfall,
} from '../triggers';
import { SurpriseCard } from '../types';
import { getCurrentPlayer, getNextPropertyOfTypeId, getNextSquareId } from './game';
import { squaresMap } from './minification/squares-map';

export const surpriseCards: SurpriseCard[] = [
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
      return triggerWindfall(game, 50);
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
      return triggerGoToJail(game, EventSource.surpriseCard);
    },
    id: 11,
    skipEvent: true,
    text: `Go to Jail. If you pass Go, do not collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      const currentPlayer = getCurrentPlayer(game);

      return triggerRepairsExpense(game, 25, {
        cardId: 12,
        source: EventSource.surpriseCard,
        playerId: currentPlayer.id,
        type: EventType.expense,
      });
    },
    id: 12,
    skipEvent: true,
    text: `Make general repairs on all your property. ${currencySymbol}25 per house`,
  },
  {
    action: (game) => {
      const currentPlayer = getCurrentPlayer(game);

      return triggerExpense(game, {
        amount: 15,
        cardId: 13,
        playerId: currentPlayer.id,
        source: EventSource.surpriseCard,
        type: EventType.expense,
      });
    },
    id: 13,
    skipEvent: true,
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
      return triggerWindfall(game, 150);
    },
    id: 15,
    text: `Your building loan matures. Collect ${currencySymbol}150`,
  },
  {
    action: (game) => {
      return triggerMovePlayer(game, 1);
    },
    id: 16,
    text: `Advance to ${squaresMap[1].name}`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 200);
    },
    id: 17,
    text: `Bank error in your favour. Collect ${currencySymbol}200`,
  },
  {
    action: (game) => {
      const currentPlayer = getCurrentPlayer(game);

      return triggerExpense(game, {
        amount: 50,
        cardId: 18,
        playerId: currentPlayer.id,
        source: EventSource.surpriseCard,
        type: EventType.expense,
      });
    },
    id: 18,
    skipEvent: true,
    text: `Doctor's fee. Pay ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 50);
    },
    id: 19,
    text: `From sale of stock you get ${currencySymbol}50`,
  },
  {
    action: triggerGetOutOfJailCard,
    id: 20,
    text: 'Get Out of Jail Free',
  },
  {
    action: (game) => {
      return triggerGoToJail(game, EventSource.surpriseCard);
    },
    id: 21,
    skipEvent: true,
    text: `Go to Jail. If you pass Go, do not collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 100);
    },
    id: 22,
    text: `Holiday fund matures. Receive ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 20);
    },
    id: 23,
    text: `Income tax refund. Collect ${currencySymbol}20`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 100);
    },
    id: 24,
    text: `Life insurance matures. Collect ${currencySymbol}100`,
  },
  {
    action: (game) => {
      const currentPlayer = getCurrentPlayer(game);

      return triggerExpense(game, {
        amount: 100,
        cardId: 25,
        playerId: currentPlayer.id,
        source: EventSource.surpriseCard,
        type: EventType.expense,
      });
    },
    id: 25,
    skipEvent: true,
    text: `Pay hospital fees of ${currencySymbol}100`,
  },
  {
    action: (game) => {
      const currentPlayer = getCurrentPlayer(game);

      return triggerExpense(game, {
        amount: 50,
        cardId: 26,
        playerId: currentPlayer.id,
        source: EventSource.surpriseCard,
        type: EventType.expense,
      });
    },
    id: 26,
    skipEvent: true,
    text: `Pay school fees of ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 25);
    },
    id: 27,
    text: `Receive ${currencySymbol}25 consultancy fee`,
  },
  {
    action: (game) => {
      const currentPlayer = getCurrentPlayer(game);

      return triggerRepairsExpense(game, 40, {
        cardId: 28,
        playerId: currentPlayer.id,
        source: EventSource.surpriseCard,
        type: EventType.expense,
      });
    },
    id: 28,
    skipEvent: true,
    text: `You are assessed for street repairs. ${currencySymbol}40 per house`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 10);
    },
    id: 29,
    text: `You have won second prize in a beauty contest. Collect ${currencySymbol}10`,
  },
  {
    action: (game) => {
      return triggerWindfall(game, 100);
    },
    id: 30,
    text: `You inherit ${currencySymbol}100`,
  },
];

export const getSurpriseCardById = (id: number): SurpriseCard => {
  return surpriseCards.find((card) => card.id === id)!;
};
