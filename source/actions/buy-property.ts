import { GameEventType, GamePhase, SquareType } from '../enums';
import { canBuy, getCurrentPlayer, getCurrentSquare } from '../logic';
import { Game } from '../types';

// TODO Move logic to applyNotifications

export const buyProperty = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const currentSquare = getCurrentSquare(game);

  if (currentSquare.type !== SquareType.property) {
    return game;
  }

  if (!canBuy(currentPlayer, currentSquare)) {
    return game;
  }

  return {
    ...game,
    players: game.players.map((p) => {
      if (p === currentPlayer) {
        p.properties = p.properties.concat([currentSquare.name]);
        p.money -= currentSquare.price;
      }
      return p;
    }),
    squares: game.squares.map((s) => {
      if (s === currentSquare) {
        s.ownerId = currentPlayer.id;
      }
      return s;
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
