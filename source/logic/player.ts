import { JailMedium, NotificationType, PropertyStatus, SquareType } from '../enums';
import { jailFine, maxTurnsInJail, passGoMoney } from '../parameters';
import { Game, Id, Notification, Player, Square } from '../types';

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

export const getOutOfJail = (game: Game, medium: JailMedium): Game => {
  const notifications: Notification[] =
    medium === JailMedium.card || medium === JailMedium.fine
      ? [
          {
            medium,
            playerId: game.currentPlayerId,
            type: NotificationType.getOutOfJail,
          },
        ]
      : [];

  const pastNotifications: Notification[] =
    medium === JailMedium.dice
      ? [
          {
            medium: JailMedium.dice,
            playerId: game.currentPlayerId,
            type: NotificationType.getOutOfJail,
          },
          ...game.pastNotifications,
        ]
      : medium === JailMedium.lastTurn
      ? [
          {
            playerId: game.currentPlayerId,
            turnsInJail: maxTurnsInJail,
            type: NotificationType.turnInJail,
          },
          ...game.pastNotifications,
        ]
      : game.pastNotifications;

  return {
    ...game,
    notifications,
    pastNotifications,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId
        ? {
            ...p,
            getOutOfJail: medium === JailMedium.card ? p.getOutOfJail - 1 : p.getOutOfJail,
            isInJail: false,
            money:
              medium === JailMedium.fine || medium === JailMedium.lastTurn
                ? p.money - jailFine
                : p.money,
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

export const turnInJail = (game: Game): Game => {
  let count = 0;

  const nextPlayers = game.players.map((p) => {
    return p.id === game.currentPlayerId ? { ...p, turnsInJail: (count = p.turnsInJail + 1) } : p;
  });
  const pastNotifications: Notification[] =
    count < maxTurnsInJail
      ? [
          {
            playerId: game.currentPlayerId,
            turnsInJail: count,
            type: NotificationType.turnInJail,
          },
          ...game.pastNotifications,
        ]
      : game.pastNotifications;

  return {
    ...game,
    pastNotifications,
    players: nextPlayers,
  };
};
