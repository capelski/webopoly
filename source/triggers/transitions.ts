import { GamePhase, LiquidationReason, TransitionType } from '../enums';
import { getCurrentPlayer, getCurrentSquare, getDiceMovement, getNextSquareId } from '../logic';
import { GameLiquidationPhase, GameUiTransitionPhase } from '../types';
import { applyDiceRoll } from './dice-roll';
import { MovePlayerOutputPhases } from './move-player';

export const triggerFirstPlayerTransition = (
  game:
    | GameUiTransitionPhase<TransitionType.dice>
    | GameUiTransitionPhase<TransitionType.jailDiceRoll>
    | GameLiquidationPhase<LiquidationReason.pendingPayment>,
): GameUiTransitionPhase<TransitionType.player> => {
  const pendingMoves = getDiceMovement(game.dice);
  const currentPlayer = getCurrentPlayer(game);

  return triggerNextPlayerTransition({
    ...game,
    phase: GamePhase.uiTransition,
    transitionType: TransitionType.player,
    transitionData: {
      currentSquareId: getCurrentSquare(game).id,
      pendingMoves,
      playerId: currentPlayer.id,
    },
  }) as GameUiTransitionPhase<TransitionType.player>;
};

export const triggerNextPlayerTransition = (
  game: GameUiTransitionPhase<TransitionType.player>,
): GameUiTransitionPhase<TransitionType.player> | MovePlayerOutputPhases => {
  const { currentSquareId, pendingMoves, playerId } = game.transitionData;
  const nextMove = 1;

  if (pendingMoves <= nextMove) {
    return applyDiceRoll({ ...game, phase: GamePhase.play });
  }

  const nextSquareId = getNextSquareId(game, nextMove, currentSquareId);
  const nextPendingMoves = pendingMoves - nextMove;

  return {
    ...game,
    phase: GamePhase.uiTransition,
    transitionType: TransitionType.player,
    transitionData: {
      currentSquareId: nextSquareId,
      pendingMoves: nextPendingMoves,
      playerId,
    },
  };
};
