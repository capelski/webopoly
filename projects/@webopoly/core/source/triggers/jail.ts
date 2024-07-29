import { jailFine, maxTurnsInJail } from '../constants';
import {
  EventType,
  GamePhase,
  JailMedium,
  LiquidationReason,
  PromptType,
  SquareType,
  TransitionType,
} from '../enums';
import { getCurrentPlayer, hasEnoughMoney } from '../logic';
import {
  GameLiquidationPhase,
  GamePlayPhase,
  GamePromptPhase,
  GameRollDicePhase,
  GameUiTransitionPhase,
  GEvent,
} from '../types';
import { EndTurnOutputPhases, triggerEndTurn } from './end-turn';
import { triggerCannotPayPrompt } from './payments';

export type PlayerOutOfJailPhases =
  | GamePromptPhase<PromptType.jailOptions>
  | GameUiTransitionPhase<TransitionType.jailDiceRoll>
  | GameLiquidationPhase<LiquidationReason.pendingPayment>;

export const triggerGetOutOfJailCard = (
  game: GamePromptPhase<PromptType.applyCard>,
): GamePlayPhase => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    phase: GamePhase.play,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, getOutOfJail: p.getOutOfJail + 1 } : p;
    }),
  };
};

export const triggerGoToJail = (
  game: GamePromptPhase<PromptType.goToJail> | GamePromptPhase<PromptType.applyCard>,
  skipEvent = false,
): GamePlayPhase => {
  const jailSquare = game.squares.find((s) => s.type === SquareType.jail)!;
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    eventHistory: skipEvent
      ? game.eventHistory
      : [
          {
            playerId: currentPlayer.id,
            type: EventType.goToJail,
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
  game:
    | GameUiTransitionPhase<TransitionType.jailDiceRoll>
    | GameLiquidationPhase<LiquidationReason.pendingPayment>,
): GameUiTransitionPhase<TransitionType.getOutOfJail> | GamePromptPhase<PromptType.cannotPay> => {
  const currentPlayer = getCurrentPlayer(game);

  if (!hasEnoughMoney(currentPlayer, jailFine)) {
    return triggerCannotPayPrompt(game, {
      playerId: currentPlayer.id,
      turnsInJail: maxTurnsInJail,
      type: EventType.turnInJail,
    });
  }

  const nextGame = updatePlayerOutOfJail(game, JailMedium.lastTurn);

  return {
    ...nextGame,
    phase: GamePhase.uiTransition,
    transitionType: TransitionType.getOutOfJail,
  };
};

export const triggerPayJailFine = (
  game: GamePromptPhase<PromptType.jailOptions>,
): EndTurnOutputPhases => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.fine);
  return triggerEndTurn(nextGame);
};

export const triggerRemainInJail = (
  game: GameUiTransitionPhase<TransitionType.jailDiceRoll>,
): GamePlayPhase => {
  const currentPlayer = getCurrentPlayer(game);
  let count = 0;

  const nextPlayers = game.players.map((p) => {
    return p.id === currentPlayer.id ? { ...p, turnsInJail: (count = p.turnsInJail + 1) } : p;
  });

  return {
    ...game,
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
  game: GameUiTransitionPhase<TransitionType.jailDiceRoll>,
): GameUiTransitionPhase<TransitionType.getOutOfJail> => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.dice);
  return {
    ...nextGame,
    phase: GamePhase.uiTransition,
    transitionType: TransitionType.getOutOfJail,
  };
};

export const triggerUseJailCard = (
  game: GamePromptPhase<PromptType.jailOptions>,
): GameRollDicePhase => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.card);
  return { ...nextGame, phase: GamePhase.rollDice };
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
