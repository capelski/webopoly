import { playerTransitionDuration } from '../constants';
import { GamePhase, GameUpdateType, LiquidationReason, PromptType, TransitionType } from '../enums';
import {
  exceedsMaxDoublesInARow,
  getCurrentPlayer,
  getCurrentSquare,
  getDiceMovement,
  getNextSquareId,
} from '../logic';
import { GameLiquidationPhase, GamePromptPhase, GameUiTransitionPhase } from '../types';
import { applyDiceRoll } from './dice-roll';
import { MovePlayerOutputPhases } from './move-player';

export const triggerFirstPlayerTransition = (
  game:
    | GameUiTransitionPhase<TransitionType.dice>
    | GameUiTransitionPhase<TransitionType.getOutOfJail>
    | GameLiquidationPhase<LiquidationReason.pendingPayment>,
): GameUiTransitionPhase<TransitionType.player> | GamePromptPhase<PromptType.goToJail> => {
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
    defaultAction: {
      interval: playerTransitionDuration * 1000,
      playerId,
      update: { type: GameUpdateType.playerTransition },
    },
    phase: GamePhase.uiTransition,
    transitionType: TransitionType.player,
    transitionData: {
      currentSquareId: nextSquareId,
      pendingMoves: nextPendingMoves,
      playerId,
    },
  };
};
