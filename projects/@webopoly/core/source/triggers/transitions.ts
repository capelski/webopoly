import { playerTransitionDuration } from '../constants';
import { GamePhase, GameUpdateType, LiquidationReason, PromptType } from '../enums';
import {
  exceedsMaxDoublesInARow,
  getCurrentPlayer,
  getCurrentSquare,
  getDiceMovement,
  getNextSquareId,
} from '../logic';
import {
  GameDiceAnimationPhase,
  GameLiquidationPhase,
  GameOutOfJailAnimationPhase,
  GamePlayerAnimationPhase,
  GamePromptPhase,
} from '../types';
import { applyDiceRoll } from './dice-roll';
import { MovePlayerOutputPhases } from './move-player';

export const triggerFirstPlayerTransition = (
  game:
    | GameDiceAnimationPhase
    | GameOutOfJailAnimationPhase
    | GameLiquidationPhase<LiquidationReason.pendingPayment>,
): GamePlayerAnimationPhase | GamePromptPhase<PromptType.goToJail> => {
  const pendingMoves = getDiceMovement(game.dice);
  const currentPlayer = getCurrentPlayer(game);

  if (exceedsMaxDoublesInARow(currentPlayer.doublesInARow)) {
    return <GamePromptPhase<PromptType.goToJail>>{
      ...game,
      defaultAction: {
        playerId: currentPlayer.id,
        update: { type: GameUpdateType.goToJail },
      },
      phase: GamePhase.prompt,
      prompt: {
        type: PromptType.goToJail,
      },
    };
  }

  return triggerNextPlayerTransition({
    ...game,
    defaultAction: {
      interval: playerTransitionDuration * 1000,
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.playerTransition },
    },
    phase: GamePhase.playerAnimation,
    animation: {
      currentSquareId: getCurrentSquare(game).id,
      pendingMoves,
      playerId: currentPlayer.id,
    },
  }) as GamePlayerAnimationPhase;
};

export const triggerNextPlayerTransition = (
  game: GamePlayerAnimationPhase,
): GamePlayerAnimationPhase | MovePlayerOutputPhases => {
  const { currentSquareId, pendingMoves, playerId } = game.animation;
  const nextMove = 1;

  if (pendingMoves <= nextMove) {
    return applyDiceRoll({ ...game, phase: GamePhase.play });
  }

  const nextSquareId = getNextSquareId(game, nextMove, currentSquareId);
  const nextPendingMoves = pendingMoves - nextMove;

  return {
    ...game,
    defaultAction: {
      interval: playerTransitionDuration * 1000,
      playerId,
      update: { type: GameUpdateType.playerTransition },
    },
    phase: GamePhase.playerAnimation,
    animation: {
      currentSquareId: nextSquareId,
      pendingMoves: nextPendingMoves,
      playerId,
    },
  };
};
