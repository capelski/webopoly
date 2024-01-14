import { ChangeType, ChangeUiType, SquareType } from '../enums';
import { canBuyProperty, getCurrentPlayer, getCurrentSquare } from '../logic';
import { Game } from '../types';

export const triggerBuyProperty = (game: Game): Game => {
  const currentSquare = getCurrentSquare(game);
  if (currentSquare.type !== SquareType.property) {
    return game;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (!canBuyProperty(currentSquare, currentPlayer)) {
    return game;
  }

  return {
    ...game,
    incomingChanges: [
      {
        playerId: currentPlayer.id,
        propertyId: currentSquare.id,
        type: ChangeType.buyProperty,
        uiType: ChangeUiType.toast,
      },
    ],
  };
};
