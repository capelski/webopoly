import { EventSource, EventType, JailMedium, PromptType, SquareType } from '../enums';
import { getCurrentPlayer, hasEnoughMoney } from '../logic';
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
            type: EventType.getOutOfJail,
          },
        ]
      : game.notifications;

  const currentPlayer = getCurrentPlayer(game);
  const paysFine = medium === JailMedium.fine || medium === JailMedium.lastTurn;

  let nextGame: Game;
  if (paysFine && !hasEnoughMoney(currentPlayer, jailFine)) {
    nextGame = {
      ...game,
      pendingNotification: {
        medium,
        playerId: game.currentPlayerId,
        type: EventType.getOutOfJail,
      },
      status: {
        type: PromptType.cannotPay,
      },
    };
  } else {
    nextGame = {
      ...game,
      notifications,
      players: game.players.map((p) => {
        return p.id === game.currentPlayerId
          ? {
              ...p,
              getOutOfJail: medium === JailMedium.card ? p.getOutOfJail - 1 : p.getOutOfJail,
              isInJail: false,
              money: paysFine ? p.money - jailFine : p.money,
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

export const triggerGoToJail = (game: Game, source: EventSource): Game => {
  const jailSquare = game.squares.find((s) => s.type === SquareType.jail)!;

  return {
    ...game,
    pastNotifications: [
      {
        playerId: game.currentPlayerId,
        source,
        type: EventType.goToJail,
      },
      ...game.pastNotifications,
    ],
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
        type: EventType.turnInJail,
      },
    ],
    players: nextPlayers,
  };

  if (count === maxTurnsInJail) {
    nextGame = triggerGetOutOfJail(nextGame, JailMedium.lastTurn);
  }

  return nextGame;
};
