import { GamePhase, PropertyStatus, PropertyType, SquareType } from '../enums';
import { getClearMortgageAmount, getCurrentPlayer, getSquareById } from '../logic';
import {
  Game,
  Game_BuyingLiquidation,
  Game_PaymentLiquidation,
  Game_Play,
  Game_RollDice,
  Player,
  PropertySquare,
  Square,
} from '../types';

export const canClearMortgage = (
  game: Game,
  squareId: Square['id'],
  windowPlayerId: Player['id'],
): {
  game: Game_Play | Game_RollDice;
  property: PropertySquare;
} | null => {
  if (game.phase !== GamePhase.play && game.phase !== GamePhase.rollDice) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  const square = getSquareById(game, squareId);
  if (
    square.type !== SquareType.property ||
    square.status !== PropertyStatus.mortgaged ||
    currentPlayer.id !== square.ownerId ||
    currentPlayer.money < getClearMortgageAmount(square)
  ) {
    return null;
  }

  return { game, property: square };
};

export const canMortgage = (
  game: Game,
  squareId: Square['id'],
  windowPlayerId: Player['id'],
): {
  game: Game_BuyingLiquidation | Game_PaymentLiquidation | Game_Play | Game_RollDice;
  property: PropertySquare;
} | null => {
  if (
    game.phase !== GamePhase.buyingLiquidation &&
    game.phase !== GamePhase.paymentLiquidation &&
    game.phase !== GamePhase.play &&
    game.phase !== GamePhase.rollDice
  ) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  const square = getSquareById(game, squareId);
  if (
    square.type !== SquareType.property ||
    square.status === PropertyStatus.mortgaged ||
    windowPlayerId !== square.ownerId ||
    (square.propertyType === PropertyType.street && square.houses > 0)
  ) {
    return null;
  }

  return { game, property: square };
};
