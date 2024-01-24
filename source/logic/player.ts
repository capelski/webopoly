import { PropertyStatus, SquareType } from '../enums';
import { jailFine, passGoMoney } from '../parameters';
import { Dice, Game, Id, Notification, Player, Square } from '../types';

export const collectCenterPot = (game: Game): Game => {
  return {
    ...game,
    centerPot: 0,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, money: p.money + game.centerPot } : p;
    }),
  };
};

export const doesPayRent = (player: Player, square: Square): boolean => {
  return (
    square.type === SquareType.property &&
    square.ownerId !== undefined &&
    square.ownerId !== player.id &&
    square.status !== PropertyStatus.mortgaged
  );
};

export const getsOutOfJail = (player: Player, dice: Dice): boolean => {
  return player.isInJail && dice[0] === dice[1];
};

export const getOutOfJail = (
  game: Game,
  { notification, paysJailFine }: { notification?: Notification; paysJailFine?: boolean } = {},
): Game => {
  return {
    ...game,
    pastNotifications: notification
      ? [notification, ...game.pastNotifications]
      : game.pastNotifications,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId
        ? {
            ...p,
            isInJail: false,
            money: paysJailFine ? p.money - jailFine : p.money,
            turnsInJail: 0,
          }
        : p;
    }),
  };
};

export const goToJail = (game: Game): Game => {
  const jailSquare = game.squares.find((s) => s.type === SquareType.jail)!;

  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, squareId: jailSquare.id, isInJail: true } : p;
    }),
  };
};

export const passesGo = (game: Game, currentSquareId: number, nextSquareId: number): boolean => {
  const currentIndex = game.squares.findIndex((s) => s.id === currentSquareId);
  const nextIndex = game.squares.findIndex((s) => s.id === nextSquareId);
  return currentIndex > nextIndex;
};

export const passGo = (game: Game): Game => {
  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, money: p.money + passGoMoney } : p;
    }),
  };
};

export const payRent = (game: Game, landlordId: Id, rent: number): Game => {
  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId
        ? { ...p, money: p.money - rent }
        : p.id === landlordId
        ? { ...p, money: p.money + rent }
        : p;
    }),
  };
};

export const payTax = (game: Game, tax: number): Game => {
  return {
    ...game,
    centerPot: game.centerPot + tax,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, money: p.money - tax } : p;
    }),
  };
};

export const turnInJail = (game: Game, notification: Notification): Game => {
  const nextPlayers = game.players.map((p) => {
    return p.id === game.currentPlayerId ? { ...p, turnsInJail: p.turnsInJail + 1 } : p;
  });

  return {
    ...game,
    pastNotifications: [notification, ...game.pastNotifications],
    players: nextPlayers,
  };
};
