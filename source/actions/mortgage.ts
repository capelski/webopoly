import { GameEventType, GamePhase } from '../enums';
import { canClearMortgage, canMortgage, getSquareById, toPropertySquare } from '../logic';
import { Game, Id } from '../types';

export const clearMortgage = (game: Game, squareId: Id): Game => {
  const property = toPropertySquare(getSquareById(game, squareId));

  if (!property || !canClearMortgage(property)) {
    return game;
  }

  return {
    ...game,
    gamePhase: GamePhase.toast,
    toasts: [
      {
        playerId: property.ownerId!,
        squareId,
        type: GameEventType.clearMortgage,
      },
    ],
  };
};

export const mortgage = (game: Game, squareId: Id): Game => {
  const property = toPropertySquare(getSquareById(game, squareId));

  if (!property || !canMortgage(property)) {
    return game;
  }

  return {
    ...game,
    gamePhase: GamePhase.toast,
    toasts: [
      {
        playerId: property.ownerId!,
        squareId: squareId,
        type: GameEventType.mortgage,
      },
    ],
  };
};
