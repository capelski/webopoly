import { ChangeType, SquareType, UiUpdateType } from '../enums';
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
    uiUpdates: [
      {
        playerId: currentPlayer.id,
        propertyId: currentSquare.id,
        type: ChangeType.buyProperty,
        uiUpdateType: UiUpdateType.notification,
      },
    ],
  };
};
