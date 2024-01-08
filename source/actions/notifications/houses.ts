import { GameEventType, NotificationType, PropertyType, SquareType } from '../../enums';
import { canBuildHouse, canSellHouse, getPlayerById, getSquareById } from '../../logic';
import { Game, Id } from '../../types';

export const notifyBuildHouse = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);
  if (
    square.type !== SquareType.property ||
    square.propertyType !== PropertyType.street ||
    !square.ownerId
  ) {
    return game;
  }

  const player = getPlayerById(game, square.ownerId);
  if (!canBuildHouse(game, square, player)) {
    return game;
  }

  return {
    ...game,
    notifications: [
      {
        notificationType: NotificationType.toast,
        playerId: square.ownerId,
        propertyId: squareId,
        type: GameEventType.buildHouse,
      },
    ],
  };
};

export const notifySellHouse = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);
  if (
    square.type !== SquareType.property ||
    square.propertyType !== PropertyType.street ||
    !square.ownerId
  ) {
    return game;
  }

  const player = getPlayerById(game, square.ownerId);
  if (!canSellHouse(game, square, player)) {
    return game;
  }

  return {
    ...game,
    notifications: [
      {
        notificationType: NotificationType.toast,
        playerId: square.ownerId,
        propertyId: squareId,
        type: GameEventType.sellHouse,
      },
    ],
  };
};
