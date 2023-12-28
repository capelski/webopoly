import { GameEventType, GamePhase, SquareType } from '../enums';
import { canClearMortgage, canMortgage, getSquareById } from '../logic';
import { Game, Id } from '../types';

export const clearMortgage = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);

  if (square.type !== SquareType.property || !canClearMortgage(square)) {
    return game;
  }

  return {
    ...game,
    gamePhase: GamePhase.toast,
    toasts: [
      {
        playerId: square.ownerId!,
        squareId,
        type: GameEventType.clearMortgage,
      },
    ],
  };
};

export const mortgage = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);

  if (square.type !== SquareType.property || !canMortgage(square)) {
    return game;
  }

  return {
    ...game,
    gamePhase: GamePhase.toast,
    toasts: [
      {
        playerId: square.ownerId!,
        squareId: squareId,
        type: GameEventType.mortgage,
      },
    ],
  };
};
