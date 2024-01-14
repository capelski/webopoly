import { ChangeType, ChangeUiType, PropertyType, SquareType } from '../enums';
import { canBuildHouse, canSellHouse, getPlayerById, getSquareById } from '../logic';
import { Game, Id } from '../types';

export const triggerBuildHouse = (game: Game, squareId: Id): Game => {
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
    incomingChanges: [
      {
        playerId: square.ownerId,
        propertyId: squareId,
        type: ChangeType.buildHouse,
        uiType: ChangeUiType.toast,
      },
    ],
  };
};

export const triggerSellHouse = (game: Game, squareId: Id): Game => {
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
    incomingChanges: [
      {
        playerId: square.ownerId,
        propertyId: squareId,
        type: ChangeType.sellHouse,
        uiType: ChangeUiType.toast,
      },
    ],
  };
};
