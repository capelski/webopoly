import { GameEventType, GamePhase } from '../enums';
import { canBuy, getCurrentPlayer, getCurrentSquare, toPropertySquare } from '../logic';
import { Game } from '../types';

export const buyProperty = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const currentSquare = getCurrentSquare(game);
  const propertySquare = toPropertySquare(currentSquare);

  if (!propertySquare) {
    return game;
  }

  if (!canBuy(currentPlayer, propertySquare)) {
    return game;
  }

  return {
    ...game,
    gamePhase: GamePhase.toast,
    toasts: [
      {
        playerId: currentPlayer.id,
        squareId: currentSquare.id,
        type: GameEventType.buyProperty,
      },
    ],
  };
};
