import { GamePhase, SquareType } from '../enums';
import { getCurrentPlayer, getSquareById } from '../logic';
import { Game, Player, PropertySquare } from '../types';

export const canBuyProperty = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.buyProperty>;
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
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.buyProperty>;
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
