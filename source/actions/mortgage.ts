import { GameEventType, GamePhase, NotificationType, SquareType } from '../enums';
import { canClearMortgage, canMortgage, getSquareById } from '../logic';
import { Game, Id } from '../types';

export const clearMortgage = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);

  if (
    square.type !== SquareType.property ||
    !square.ownerId ||
    !canClearMortgage(square, square.ownerId)
  ) {
    return game;
  }

  return {
    ...game,
    gamePhase: GamePhase.toast,
    notifications: [
      {
        notificationType: NotificationType.toast,
        playerId: square.ownerId,
        squareId,
        type: GameEventType.clearMortgage,
      },
    ],
  };
};

export const mortgage = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);

  if (
    square.type !== SquareType.property ||
    !square.ownerId ||
    !canMortgage(square, square.ownerId)
  ) {
    return game;
  }

  return {
    ...game,
    gamePhase: GamePhase.toast,
    notifications: [
      {
        notificationType: NotificationType.toast,
        playerId: square.ownerId,
        squareId,
        type: GameEventType.mortgage,
      },
    ],
  };
};
