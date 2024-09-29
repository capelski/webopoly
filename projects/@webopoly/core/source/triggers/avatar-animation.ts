import { playerTransitionDuration } from '../constants';
import { GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer, getCurrentSquare, getDiceMovement } from '../logic';
import { Game } from '../types';

export const triggerAvatarAnimation = (
  game:
    | Game<GamePhase.diceAnimation> // Right after dice roll
    | Game<GamePhase.outOfJailAnimation>, // Player gets out of jail
): Game<GamePhase.avatarAnimation> => {
  const currentPlayer = getCurrentPlayer(game);
  const pendingMoves = getDiceMovement(game.dice);

  return {
    ...game,
    defaultAction: {
      interval: playerTransitionDuration * 1000 * pendingMoves,
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.applyDiceRoll },
    },
    phase: GamePhase.avatarAnimation,
    phaseData: {
      currentSquareId: getCurrentSquare(game).id,
      pendingMoves,
    },
  };
};
