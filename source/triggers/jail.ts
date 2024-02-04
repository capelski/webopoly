import { EventSource, EventType, GamePhase, JailMedium, PromptType, SquareType } from '../enums';
import { getCurrentPlayer, hasEnoughMoney } from '../logic';
import { jailFine, maxTurnsInJail } from '../parameters';
import {
  GameCannotPayPhase,
  GamePlayPhase,
  GamePromptPhase,
  GameRollDicePhase,
  GEvent,
} from '../types';
import { applyDiceRoll } from './dice-roll';
import { EndTurnOutputPhases, triggerEndTurn } from './end-turn';
import { MovePlayerOutputPhases } from './move-player';
import { triggerCannotPayPrompt } from './payments';

export const triggerGetOutOfJailCard = (game: GamePromptPhase<PromptType.card>): GamePlayPhase => {
  return {
    ...game,
    phase: GamePhase.play,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, getOutOfJail: p.getOutOfJail + 1 } : p;
    }),
  };
};

export const triggerGoToJail = (
  game: GamePromptPhase<PromptType.goToJail> | GamePromptPhase<PromptType.card>,
  source: EventSource,
): GamePlayPhase => {
  const jailSquare = game.squares.find((s) => s.type === SquareType.jail)!;

  return {
    ...game,
    eventHistory: [
      {
        playerId: game.currentPlayerId,
        source,
        type: EventType.goToJail,
      },
      ...game.eventHistory,
    ],
    phase: GamePhase.play,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, squareId: jailSquare.id, isInJail: true } : p;
    }),
  };
};

export const triggerLastTurnInJail = (
  game: GamePromptPhase<PromptType.jailOptions> | GameCannotPayPhase,
): MovePlayerOutputPhases => {
  const currentPlayer = getCurrentPlayer(game);

  if (!hasEnoughMoney(currentPlayer, jailFine)) {
    return triggerCannotPayPrompt(game, {
      playerId: game.currentPlayerId,
      turnsInJail: maxTurnsInJail,
      type: EventType.turnInJail,
    });
  }

  const nextGame = updatePlayerOutOfJail(game, JailMedium.lastTurn);
  return applyDiceRoll(nextGame);
};

export const triggerPayJailFine = (
  game: GamePromptPhase<PromptType.jailOptions>,
): EndTurnOutputPhases => {
  const currentPlayer = getCurrentPlayer(game);

  if (!hasEnoughMoney(currentPlayer, jailFine)) {
    return { ...game };
  }

  const nextGame = updatePlayerOutOfJail(game, JailMedium.fine);
  return triggerEndTurn(nextGame);
};

export const triggerRemainInJail = (
  game: GamePromptPhase<PromptType.jailOptions>,
): GamePlayPhase => {
  let count = 0;

  const nextPlayers = game.players.map((p) => {
    return p.id === game.currentPlayerId ? { ...p, turnsInJail: (count = p.turnsInJail + 1) } : p;
  });

  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: game.currentPlayerId,
        turnsInJail: count,
        type: EventType.turnInJail,
      },
    ],
    phase: GamePhase.play,
    players: nextPlayers,
  };
};

export const triggerRollDoublesInJail = (
  game: GamePromptPhase<PromptType.jailOptions>,
): MovePlayerOutputPhases => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.dice);
  return applyDiceRoll(nextGame);
};

export const triggerUseJailCard = (
  game: GamePromptPhase<PromptType.jailOptions>,
): GameRollDicePhase => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.card);
  return { ...nextGame, phase: GamePhase.rollDice };
};

const updatePlayerOutOfJail = (
  game: GamePromptPhase<PromptType.jailOptions> | GameCannotPayPhase,
  medium: JailMedium,
): GamePlayPhase => {
  const notification: GEvent =
    medium === JailMedium.card || medium === JailMedium.dice || medium === JailMedium.fine
      ? {
          medium,
          playerId: game.currentPlayerId,
          type: EventType.getOutOfJail,
        }
      : {
          playerId: game.currentPlayerId,
          turnsInJail: maxTurnsInJail,
          type: EventType.turnInJail,
        };

  return {
    ...game,
    notifications: [...game.notifications, notification],
    phase: GamePhase.play,
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
