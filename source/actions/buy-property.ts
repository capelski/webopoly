import { GameEventType, GamePhase } from '../enums';
import { canBuy, getCurrentPlayer, getCurrentSquare, toPropertySquare } from '../logic';
import { Game } from '../types';

// TODO Move logic to applyNotifications

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
    players: game.players.map((player) => {
      if (player === currentPlayer) {
        player.properties = player.properties.concat([currentSquare.id]);
        player.money -= propertySquare.price;
      }
      return player;
    }),
    squares: game.squares.map((square) => {
      if (square === propertySquare) {
        square.ownerId = currentPlayer.id;
      }
      return square;
    }),
    gamePhase: GamePhase.toast,
    toasts: [
      {
        playerId: currentPlayer.id,
        squareName: currentSquare.name, // TODO Use Id
        type: GameEventType.buyProperty,
      },
    ],
  };
};
