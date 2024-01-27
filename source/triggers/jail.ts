import { JailMedium, NotificationType, SquareType } from '../enums';
import { jailFine, maxTurnsInJail } from '../parameters';
import { Game, Notification } from '../types';
import { applyDiceRoll } from './dice-roll';
import { triggerEndTurn } from './end-turn';

export const triggerGetOutOfJail = (game: Game, medium: JailMedium): Game => {
  const notifications: Notification[] =
    medium === JailMedium.card || medium === JailMedium.dice || medium === JailMedium.fine
      ? [
          ...game.notifications,
          {
            medium,
            playerId: game.currentPlayerId,
            type: NotificationType.getOutOfJail,
          },
        ]
      : game.notifications;

  let nextGame: Game = {
    ...game,
    notifications,
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

  if (medium === JailMedium.fine) {
    nextGame = triggerEndTurn(nextGame);
  } else if (medium === JailMedium.dice || medium === JailMedium.lastTurn) {
    nextGame = applyDiceRoll(nextGame);
  }

  return nextGame;
};

export const triggerGetOutOfJailCard = (game: Game) => {
  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, getOutOfJail: p.getOutOfJail + 1 } : p;
    }),
  };
};

export const triggerGoToJail = (
  game: Game,
  {
    skipPastNotification,
  }: {
    /** This trigger can be activated from Cards as well, which already generate a notification  */
    skipPastNotification?: boolean;
  } = {},
): Game => {
  const jailSquare = game.squares.find((s) => s.type === SquareType.jail)!;
  const pastNotifications: Notification[] = skipPastNotification
    ? game.pastNotifications
    : [
        {
          playerId: game.currentPlayerId,
          type: NotificationType.goToJail,
        },
        ...game.pastNotifications,
      ];

  return {
    ...game,
    pastNotifications,
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

  let nextGame: Game = {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: game.currentPlayerId,
        turnsInJail: count,
        type: NotificationType.turnInJail,
      },
    ],
    players: nextPlayers,
  };

  if (count === maxTurnsInJail) {
    nextGame = triggerGetOutOfJail(nextGame, JailMedium.lastTurn);
  }

  return nextGame;
};
