import { GamePhase, LiquidationReason, PromptType, SquareType } from '../enums';
import { castPromptGame, getCurrentPlayer, getSquareById } from '../logic';
import { Game, GameLiquidationPhase, GamePromptPhase, Player } from '../types';

export const canLiquidateBuyProperty = (
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

  const originalPlayer = getCurrentPlayer(game, { omitTurnConsiderations: true });
  const square = getSquareById(game, originalPlayer.squareId);
  if (square.type !== SquareType.property || currentPlayer.money >= square.price) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
};

export const canLiquidatePendingPayment = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GamePromptPhase<PromptType.cannotPay>;
} | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.cannotPay) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
};

export const canResume = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GameLiquidationPhase<LiquidationReason>;
} | null => {
  if (game.phase !== GamePhase.liquidation) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};
