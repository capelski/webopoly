import { GamePhase, SquareType } from '../enums';
import { getCurrentPlayer, getSquareById } from '../logic';
import { Game, GameBuyPropertyPhase, Player, PropertySquare } from '../types';

export const canBuyProperty = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GameBuyPropertyPhase;
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
  game: GameBuyPropertyPhase;
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
