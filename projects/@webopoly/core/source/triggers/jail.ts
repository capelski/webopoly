import { jailFine, maxTurnsInJail, playerTransitionDuration } from '../constants';
import { EventType, GamePhase, GameUpdateType, JailMedium, SquareType } from '../enums';
import { exceedsMaxDoublesInARow, getCurrentPlayer, hasEnoughMoney } from '../logic';
import {
  Game_ApplyCard,
  Game_CannotPay,
  Game_DiceInJailAnimation,
  Game_GoToJail,
  Game_JailOptions,
  Game_OutOfJailAnimation,
  Game_PaymentLiquidation,
  Game_Play,
  Game_RollDice,
  GEvent,
} from '../types';
import { EndTurnOutputPhases, triggerEndTurn } from './end-turn';
import { triggerCannotPay } from './payments';

export type PlayerOutOfJailPhases =
  | Game_JailOptions
  | Game_DiceInJailAnimation
  | Game_PaymentLiquidation;

export const triggerGetOutOfJailCard = (game: Game_ApplyCard): Game_Play => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    defaultAction: {
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.endTurn },
    },
    phase: GamePhase.play,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, getOutOfJail: p.getOutOfJail + 1 } : p;
    }),
  };
};

export const triggerGoToJail = (
  game: Game_ApplyCard | Game_GoToJail,
  skipEvent = false,
): Game_Play => {
  const jailSquare = game.squares.find((s) => s.type === SquareType.jail)!;
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    defaultAction: {
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.endTurn },
    },
    eventHistory: skipEvent
      ? game.eventHistory
      : [
          {
            playerId: currentPlayer.id,
            type: EventType.goToJail,
            tooManyDoublesInARow: exceedsMaxDoublesInARow(currentPlayer.doublesInARow),
          },
          ...game.eventHistory,
        ],
    phase: GamePhase.play,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, squareId: jailSquare.id, isInJail: true } : p;
    }),
  };
};

export const triggerLastTurnInJail = (
  game: Game_DiceInJailAnimation | Game_PaymentLiquidation,
): Game_OutOfJailAnimation | Game_CannotPay => {
  const currentPlayer = getCurrentPlayer(game);

  if (!hasEnoughMoney(currentPlayer, jailFine)) {
    return triggerCannotPay(game, {
      playerId: currentPlayer.id,
      turnsInJail: maxTurnsInJail,
      type: EventType.turnInJail,
    });
  }

  const nextGame = updatePlayerOutOfJail(game, JailMedium.lastTurn);

  return {
    ...nextGame,
    defaultAction: {
      interval: playerTransitionDuration * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.getOutOfJail },
    },
    phase: GamePhase.outOfJailAnimation,
  };
};

export const triggerPayJailFine = (game: Game_JailOptions): EndTurnOutputPhases => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.fine);
  return triggerEndTurn(nextGame);
};

export const triggerRemainInJail = (game: Game_DiceInJailAnimation): Game_Play => {
  const currentPlayer = getCurrentPlayer(game);
  let count = 0;

  const nextPlayers = game.players.map((p) => {
    return p.id === currentPlayer.id ? { ...p, turnsInJail: (count = p.turnsInJail + 1) } : p;
  });

  return {
    ...game,
    defaultAction: {
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.endTurn },
    },
    notifications: [
      ...game.notifications,
      {
        playerId: currentPlayer.id,
        turnsInJail: count,
        type: EventType.turnInJail,
      },
    ],
    phase: GamePhase.play,
    players: nextPlayers,
  };
};

export const triggerRollDoublesInJail = (
  game: Game_DiceInJailAnimation,
): Game_OutOfJailAnimation => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.dice);
  return {
    ...nextGame,
    defaultAction: {
      interval: playerTransitionDuration * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.getOutOfJail },
    },
    phase: GamePhase.outOfJailAnimation,
  };
};

export const triggerUseJailCard = (game: Game_JailOptions): Game_RollDice => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.card);
  return {
    ...nextGame,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.rollDice },
    },
    phase: GamePhase.rollDice,
  };
};

const updatePlayerOutOfJail = <TGame extends PlayerOutOfJailPhases>(
  game: TGame,
  medium: JailMedium,
): TGame => {
  const currentPlayer = getCurrentPlayer(game);
  const notification: GEvent =
    medium === JailMedium.card || medium === JailMedium.dice || medium === JailMedium.fine
      ? {
          medium,
          playerId: currentPlayer.id,
          type: EventType.getOutOfJail,
        }
      : {
          playerId: currentPlayer.id,
          turnsInJail: maxTurnsInJail,
          type: EventType.turnInJail,
        };

  const nextGame: TGame = {
    ...game,
    notifications: [...game.notifications, notification],
    players: game.players.map((p) => {
      return p.id === currentPlayer.id
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

  return nextGame;
};
