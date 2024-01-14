import { ChangeType, ChangeUiType, SquareType } from '../enums';
import { canClearMortgage, canMortgage, getPlayerById, getSquareById } from '../logic';
import { Game, Id } from '../types';

export const triggerClearMortgage = (game: Game, squareId: Id): Game => {
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
    incomingChanges: [
      {
        playerId: square.ownerId,
        propertyId: squareId,
        type: ChangeType.clearMortgage,
        uiType: ChangeUiType.toast,
      },
    ],
  };
};

export const triggerMortgage = (game: Game, squareId: Id): Game => {
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
    incomingChanges: [
      {
        playerId: square.ownerId,
        propertyId: squareId,
        type: ChangeType.mortgage,
        uiType: ChangeUiType.toast,
      },
    ],
  };
};
