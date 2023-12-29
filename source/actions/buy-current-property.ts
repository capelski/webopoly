import { GameEventType, GamePhase, NotificationType, SquareType } from '../enums';
import { canBuy, getCurrentPlayer, getCurrentSquare } from '../logic';
import { Game } from '../types';

export const buyCurrentProperty = (game: Game): Game => {
  const currentSquare = getCurrentSquare(game);
  if (currentSquare.type !== SquareType.property) {
    return game;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (!canBuy(currentPlayer, currentSquare)) {
    return game;
  }

  return {
    ...game,
    gamePhase: GamePhase.toast,
    notifications: [
      {
        notificationType: NotificationType.toast,
        playerId: currentPlayer.id,
        squareId: currentSquare.id,
        type: GameEventType.buyProperty,
      },
    ],
  };
};
