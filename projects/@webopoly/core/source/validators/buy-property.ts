import { GamePhase, SquareType } from '../enums';
import { getCurrentPlayer, getSquareById } from '../logic';
import { Game, Game_BuyProperty, Player, PropertySquare } from '../types';

export const canBuyProperty = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: Game_BuyProperty;
  square: PropertySquare;
} | null => {
  if (game.phase !== GamePhase.buyProperty) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  const originalPlayer = getCurrentPlayer(game, { omitTurnConsiderations: true });
  const square = getSquareById(game, originalPlayer.squareId);
  if (square.type !== SquareType.property || currentPlayer.money < square.price) {
    return null;
  }

  return { game, square };
};

export const canRejectProperty = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: Game_BuyProperty;
} | null => {
  if (game.phase !== GamePhase.buyProperty) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};
