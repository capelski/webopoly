import { playerTransitionDuration } from '../constants';
import { GamePhase, GameUpdateType } from '../enums';
import {
  exceedsMaxDoublesInARow,
  getCurrentPlayer,
  getCurrentSquare,
  getDiceMovement,
  getNextSquareId,
} from '../logic';
import { Game } from '../types';
import { applyDiceRoll } from './dice-roll';
import { MovePlayerOutputPhases } from './move-player';

export const triggerFirstPlayerTransition = (
  game:
    | Game<GamePhase.diceAnimation>
    | Game<GamePhase.outOfJailAnimation>
    | Game<GamePhase.paymentLiquidation>,
): Game<GamePhase.playerAnimation> | Game<GamePhase.goToJail> => {
  const pendingMoves = getDiceMovement(game.dice);
  const currentPlayer = getCurrentPlayer(game);

  if (exceedsMaxDoublesInARow(currentPlayer.doublesInARow)) {
    return <Game<GamePhase.goToJail>>{
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
  }) as Game<GamePhase.playerAnimation>;
};

export const triggerNextPlayerTransition = (
  game: Game<GamePhase.playerAnimation>,
): Game<GamePhase.playerAnimation> | MovePlayerOutputPhases => {
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
