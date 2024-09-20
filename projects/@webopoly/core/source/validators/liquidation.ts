import { GamePhase, SquareType } from '../enums';
import { getCurrentPlayer, getSquareById } from '../logic';
import {
  Game,
  Game_BuyProperty,
  Game_BuyingLiquidation,
  Game_CannotPay,
  Game_PaymentLiquidation,
  Player,
} from '../types';

export const canLiquidateBuyProperty = (
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

  const originalPlayer = getCurrentPlayer(game, { omitTurnConsiderations: true });
  const square = getSquareById(game, originalPlayer.squareId);
  if (square.type !== SquareType.property || currentPlayer.money >= square.price) {
    return null;
  }

  return { game };
};

export const canLiquidatePendingPayment = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: Game_CannotPay;
} | null => {
  if (game.phase !== GamePhase.cannotPay) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};

export const canResume = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: Game_BuyingLiquidation | Game_PaymentLiquidation;
} | null => {
  if (game.phase !== GamePhase.buyingLiquidation && game.phase !== GamePhase.paymentLiquidation) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};
