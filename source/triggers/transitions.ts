import { GamePhase, TransitionType } from '../enums';
import { getCurrentPlayer, getCurrentSquare, getDiceMovement, getNextSquareId } from '../logic';
import { GameUiTransitionPhase } from '../types';
import { applyDiceRoll } from './dice-roll';
import { MovePlayerOutputPhases } from './move-player';

export const triggerDiceTransition = (
  game: GameUiTransitionPhase<TransitionType.dice>,
): GameUiTransitionPhase<TransitionType.player> | MovePlayerOutputPhases => {
  const pendingMoves = getDiceMovement(game.dice);
  const currentPlayer = getCurrentPlayer(game);

  return triggerPlayerTransition({
    ...game,
    phase: GamePhase.uiTransition,
    transitionType: TransitionType.player,
    transitionData: {
      currentSquareId: getCurrentSquare(game).id,
      pendingMoves,
      playerId: currentPlayer.id,
    },
  });
};

export const triggerPlayerTransition = (
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
