import { NotificationType, PromptType, PropertyType, SquareType } from '../enums';
import { getCurrentPlayer, getOtherPlayers, hasEnoughMoney } from '../logic';
import { ExpenseCardNotification, ExpenseNotification, Game, Id, StreetSquare } from '../types';

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
        prompt: {
          notification,
          playerId: game.currentPlayerId,
          type: PromptType.cannotPay,
        },
      };

  return nextGame;
};

export const triggerPayRent = (game: Game, landlordId: Id, rent: number): Game => {
  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        landlordId,
        playerId: game.currentPlayerId,
        rent,
        type: NotificationType.payRent,
      },
    ],
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId
        ? { ...p, money: p.money - rent }
        : p.id === landlordId
        ? { ...p, money: p.money + rent }
        : p;
    }),
  };
};

export const triggerPayToAllPlayers = (game: Game, amount: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const otherPlayersId = getOtherPlayers(game, game.currentPlayerId).map((p) => p.id);
  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id
        ? { ...p, money: p.money - otherPlayersId.length * amount }
        : otherPlayersId.includes(p.id)
        ? { ...p, money: p.money + amount }
        : p;
    }),
  };
};

export const triggerReceiveFromAllPlayers = (game: Game, amount: number): Game => {
  return triggerPayToAllPlayers(game, -amount);
};

export const triggerReceivePayout = (game: Game, payout: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, money: p.money + payout } : p;
    }),
  };
};

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