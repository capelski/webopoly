import { GameEventType, SquareType } from '../enums';
import { canBuy, getCurrentPlayer, getCurrentSquare } from '../logic';
import { Game } from '../types';

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
        s.owner = currentPlayer.name;
      }
      return s;
    }),
    events: [
      {
        description: `${currentPlayer.name} buys ${currentSquare.name} for $${currentSquare.price}`,
        type: GameEventType.buyProperty,
      },
    ].concat(game.events),
  };
};
