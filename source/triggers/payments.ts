import { NotificationType, PromptType, PropertyType, SquareType } from '../enums';
import { getCurrentPlayer, hasEnoughMoney } from '../logic';
import {
  ExpenseCardNotification,
  ExpenseNotification,
  Game,
  Id,
  Notification,
  StreetSquare,
} from '../types';

export const triggerExpense = (game: Game, notification: ExpenseNotification): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const nextGame: Game = hasEnoughMoney(currentPlayer, notification.amount)
    ? {
        ...game,
        centerPot: game.centerPot + notification.amount,
        notifications: [...game.notifications, notification],
        players: game.players.map((p) => {
          return p.id === currentPlayer.id ? { ...p, money: p.money - notification.amount } : p;
        }),
      }
    : {
        ...game,
        pendingNotification: notification,
        status: {
          type: PromptType.cannotPay,
        },
      };

  return nextGame;
};

export const triggerPayRent = (game: Game, landlordId: Id, amount: number): Game => {
  const notification: Notification = {
    landlordId,
    playerId: game.currentPlayerId,
    amount,
    type: NotificationType.payRent,
  };

  const currentPlayer = getCurrentPlayer(game);
  const nextGame: Game = hasEnoughMoney(currentPlayer, amount)
    ? {
        ...game,
        notifications: [...game.notifications, notification],
        players: game.players.map((p) => {
          return p.id === game.currentPlayerId
            ? { ...p, money: p.money - amount }
            : p.id === landlordId
            ? { ...p, money: p.money + amount }
            : p;
        }),
      }
    : {
        ...game,
        pendingNotification: notification,
        status: {
          type: PromptType.cannotPay,
        },
      };

  return nextGame;
};

// This function requires a new type of notification (e.g. ExpenseBroadcastNotification);
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
  partialNotification: Omit<ExpenseCardNotification, 'amount'>,
): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const playerStreets = game.squares.filter(
    (s) =>
      s.type === SquareType.property &&
      s.propertyType === PropertyType.street &&
      s.ownerId === currentPlayer.id,
  ) as StreetSquare[];
  const houses = playerStreets.reduce((reduced, property) => reduced + property.houses, 0);
  const notification: ExpenseCardNotification = {
    ...partialNotification,
    amount: houses * housePrice,
  };

  return triggerExpense(game, notification);
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
