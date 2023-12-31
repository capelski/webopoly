import { GameEventType, NotificationType, SquareType } from '../../enums';
import { canClearMortgage, canMortgage, getPlayerById, getSquareById } from '../../logic';
import { Game, Id } from '../../types';

export const notifyClearMortgage = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);
  if (square.type !== SquareType.property || !square.ownerId) {
    return game;
  }

  const player = getPlayerById(game, square.ownerId);
  if (!canClearMortgage(square, player)) {
    return game;
  }

  return {
    ...game,
    notifications: [
      {
        notificationType: NotificationType.toast,
        playerId: square.ownerId,
        propertyId: squareId,
        type: GameEventType.clearMortgage,
      },
    ],
  };
};

export const notifyMortgage = (game: Game, squareId: Id): Game => {
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
    notifications: [
      {
        notificationType: NotificationType.toast,
        playerId: square.ownerId,
        propertyId: squareId,
        type: GameEventType.mortgage,
      },
    ],
  };
};
