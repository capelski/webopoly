import { GamePhase, PromptType, SquareType } from '../enums';
import { castPromptGame, getCurrentPlayer, getSquareById } from '../logic';
import { Game, GamePromptPhase, Player, PropertySquare } from '../types';

export const canBuyProperty = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GamePromptPhase<PromptType.buyProperty>;
  square: PropertySquare;
} | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.buyProperty) {
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

  return { game: castPromptGame(game, game.prompt), square };
};

export const canRejectProperty = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GamePromptPhase<PromptType.buyProperty>;
} | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.buyProperty) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
};
