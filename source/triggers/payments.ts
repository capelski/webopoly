import { GamePhaseName, PromptType, PropertyType, SquareType } from '../enums';
import { getCurrentPlayer, hasEnoughMoney } from '../logic';
import {
  ExpenseCardEvent,
  ExpenseEvent,
  Game,
  PayRentEvent,
  PendingEvent,
  StreetSquare,
} from '../types';

export const triggerCannotPay = (game: Game, event: PendingEvent): Game => {
  return {
    ...game,
    pendingEvent: event,
    phase: {
      name: GamePhaseName.prompt,
      prompt: {
        type: PromptType.cannotPay,
      },
    },
  };
};

export const triggerExpense = (game: Game, event: ExpenseEvent): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const nextGame: Game = hasEnoughMoney(currentPlayer, event.amount)
    ? {
        ...game,
        centerPot: game.centerPot + event.amount,
        notifications: [...game.notifications, event],
        players: game.players.map((p) => {
          return p.id === currentPlayer.id ? { ...p, money: p.money - event.amount } : p;
        }),
      }
    : triggerCannotPay(game, event);

  return nextGame;
};

export const triggerPayRent = (game: Game, event: PayRentEvent): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const nextGame: Game = hasEnoughMoney(currentPlayer, event.amount)
    ? {
        ...game,
        notifications: [...game.notifications, event],
        players: game.players.map((p) => {
          return p.id === game.currentPlayerId
            ? { ...p, money: p.money - event.amount }
            : p.id === event.landlordId
            ? { ...p, money: p.money + event.amount }
            : p;
        }),
      }
    : triggerCannotPay(game, event);

  return nextGame;
};

// This function requires a new type of event (e.g. ExpenseBroadcastEvent);
// not wildly complicated but a lot of effort for little gain
// export const triggerPayToAllPlayers = (game: Game, amount: number): Game => {
//   const currentPlayer = getCurrentPlayer(game);
//   const otherPlayersId = getOtherPlayers(game, game.currentPlayerId).map((p) => p.id);

//   return {
//     ...game,
//     players: game.players.map((p) => {
//       return p.id === currentPlayer.id
//         ? // PENDING Assess player money
//           { ...p, money: p.money - otherPlayersId.length * amount }
//         : otherPlayersId.includes(p.id)
//         ? { ...p, money: p.money + amount }
//         : p;
//     }),
//   };
// };

// This function can cause a player to go bankrupt outside of its turn; significant changes
// are required to switch the currentPlayerId in the middle of a player turn
// export const triggerReceiveFromAllPlayers = (game: Game, amount: number): Game => {
//   const currentPlayer = getCurrentPlayer(game);
//   const otherPlayersId = getOtherPlayers(game, game.currentPlayerId).map((p) => p.id);

//   return {
//     ...game,
//     players: game.players.map((p) => {
//       return p.id === currentPlayer.id
//         ? { ...p, money: p.money + otherPlayersId.length * amount }
//         : otherPlayersId.includes(p.id)
//         ? // PENDING Assess each other player money
//           { ...p, money: p.money - amount }
//         : p;
//     }),
//   };
// };

export const triggerRepairsExpense = (
  game: Game,
  housePrice: number,
  partialEvent: Omit<ExpenseCardEvent, 'amount'>,
): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const playerStreets = game.squares.filter(
    (s) =>
      s.type === SquareType.property &&
      s.propertyType === PropertyType.street &&
      s.ownerId === currentPlayer.id,
  ) as StreetSquare[];
  const houses = playerStreets.reduce((reduced, property) => reduced + property.houses, 0);

  return triggerExpense(game, {
    ...partialEvent,
    amount: houses * housePrice,
  });
};

export const triggerWindfall = (game: Game, payout: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, money: p.money + payout } : p;
    }),
  };
};
