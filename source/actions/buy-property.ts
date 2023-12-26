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
      return player === currentPlayer
        ? {
            ...player,
            properties: player.properties.concat([currentSquare.id]),
            money: player.money - propertySquare.price,
          }
        : player;
    }),
    squares: game.squares.map((square) => {
      return square === propertySquare ? { ...square, ownerId: currentPlayer.id } : square;
    }),
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
