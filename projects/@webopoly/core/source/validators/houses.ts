import { housesMax } from '../constants';
import { GamePhase, PropertyStatus, PropertyType, SquareType } from '../enums';
import {
  getBuildHouseAmount,
  getCurrentPlayer,
  getNeighborhoodStreets,
  getSquareById,
} from '../logic';
import {
  Game,
  Game_BuyingLiquidation,
  Game_PaymentLiquidation,
  Game_Play,
  Game_RollDice,
  Player,
  Square,
  StreetSquare,
} from '../types';

export const canBuildHouse = (
  game: Game,
  squareId: Square['id'],
  windowPlayerId: Player['id'],
): {
  game: Game_Play | Game_RollDice;
  street: StreetSquare;
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
    square.propertyType !== PropertyType.street ||
    square.status === PropertyStatus.mortgaged ||
    windowPlayerId !== square.ownerId ||
    square.houses >= housesMax ||
    currentPlayer.money < getBuildHouseAmount(square)
  ) {
    return null;
  }

  const neighborhoodStreets = getNeighborhoodStreets(game.squares, square);
  const allOwned = neighborhoodStreets.every((p) => p.ownerId === windowPlayerId);
  const smallestHouseNumber = neighborhoodStreets.reduce(
    (reduced, p) => Math.min(reduced, p.houses),
    housesMax,
  );
  if (!allOwned || square.houses > smallestHouseNumber) {
    return null;
  }

  return { game, street: square };
};

export const canSellHouse = (
  game: Game,
  squareId: Square['id'],
  windowPlayerId: Player['id'],
): {
  game: Game_BuyingLiquidation | Game_PaymentLiquidation | Game_Play | Game_RollDice;
  street: StreetSquare;
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
    square.propertyType !== PropertyType.street ||
    square.houses <= 0 ||
    windowPlayerId !== square.ownerId
  ) {
    return null;
  }

  const neighborhoodStreets = getNeighborhoodStreets(game.squares, square);
  const biggestHouseNumber = neighborhoodStreets.reduce(
    (reduced, p) => Math.max(reduced, p.houses),
    0,
  );
  if (square.houses < biggestHouseNumber) {
    return null;
  }

  return { game, street: square };
};
