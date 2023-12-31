import { GameEventType, NotificationType, SquareType } from '../../enums';
import { canBuyProperty, getCurrentPlayer, getCurrentSquare } from '../../logic';
import { Game } from '../../types';

export const notifyBuyProperty = (game: Game): Game => {
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
    notifications: [
      {
        notificationType: NotificationType.toast,
        playerId: currentPlayer.id,
        propertyId: currentSquare.id,
        type: GameEventType.buyProperty,
      },
    ],
  };
};
