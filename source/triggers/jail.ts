import { JailMedium, NotificationType, SquareType } from '../enums';
import { jailFine, maxTurnsInJail } from '../parameters';
import { Game, Notification } from '../types';

export const triggerGetOutOfJail = (game: Game, medium: JailMedium): Game => {
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

export const triggerGetOutOfJailCard = (game: Game) => {
  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, getOutOfJail: p.getOutOfJail + 1 } : p;
    }),
  };
};

export const triggerGoToJail = (game: Game): Game => {
  const jailSquare = game.squares.find((s) => s.type === SquareType.jail)!;

  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, squareId: jailSquare.id, isInJail: true } : p;
    }),
  };
};

export const triggerTurnInJail = (game: Game): Game => {
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
