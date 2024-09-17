import { playerTransitionDuration } from '../constants';
import { GamePhase, GameUpdateType } from '../enums';
import {
  exceedsMaxDoublesInARow,
  getCurrentPlayer,
  getCurrentSquare,
  getDiceMovement,
  getNextSquareId,
} from '../logic';
import {
  GameDiceAnimationPhase,
  GameGoToJailPhase,
  GameOutOfJailAnimationPhase,
  GamePendingPaymentLiquidationPhase,
  GamePlayerAnimationPhase,
} from '../types';
import { applyDiceRoll } from './dice-roll';
import { MovePlayerOutputPhases } from './move-player';

export const triggerFirstPlayerTransition = (
  game: GameDiceAnimationPhase | GameOutOfJailAnimationPhase | GamePendingPaymentLiquidationPhase,
): GamePlayerAnimationPhase | GameGoToJailPhase => {
  const pendingMoves = getDiceMovement(game.dice);
  const currentPlayer = getCurrentPlayer(game);

  if (exceedsMaxDoublesInARow(currentPlayer.doublesInARow)) {
    return <GameGoToJailPhase>{
      ...game,
      defaultAction: {
        playerId: currentPlayer.id,
        update: { type: GameUpdateType.goToJail },
      },
      phase: GamePhase.goToJail,
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
    phaseData: {
      currentSquareId: getCurrentSquare(game).id,
      pendingMoves,
      playerId: currentPlayer.id,
    },
  }) as GamePlayerAnimationPhase;
};

export const triggerNextPlayerTransition = (
  game: GamePlayerAnimationPhase,
): GamePlayerAnimationPhase | MovePlayerOutputPhases => {
  const { currentSquareId, pendingMoves, playerId } = game.phaseData;
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
    phaseData: {
      currentSquareId: nextSquareId,
      pendingMoves: nextPendingMoves,
      playerId,
    },
  };
};