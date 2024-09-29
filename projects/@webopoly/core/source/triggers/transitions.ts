import { playerTransitionDuration } from '../constants';
import { GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer, getCurrentSquare, getDiceMovement, getNextSquareId } from '../logic';
import { Game } from '../types';

export const triggerPlayerAnimation = (
  game:
    | Game<GamePhase.diceAnimation> // Right after dice roll
    | Game<GamePhase.outOfJailAnimation> // Player gets out of jail
    | Game<GamePhase.playerAnimation>, // Following a previous player animation
): Game<GamePhase.playerAnimation> => {
  const currentPlayer = getCurrentPlayer(game);

  const { pendingMoves, currentSquareId } =
    game.phase === GamePhase.playerAnimation
      ? {
          currentSquareId: getNextSquareId(game, 1, game.phaseData.currentSquareId),
          pendingMoves: game.phaseData.pendingMoves - 1,
        }
      : {
          currentSquareId: getCurrentSquare(game).id,
          pendingMoves: getDiceMovement(game.dice),
        };

  return {
    ...game,
    defaultAction: {
      interval: playerTransitionDuration * 1000,
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.playerTransition },
    },
    phase: GamePhase.playerAnimation,
    phaseData: {
      currentSquareId,
      pendingMoves,
      playerId: currentPlayer.id,
    },
  };
};
