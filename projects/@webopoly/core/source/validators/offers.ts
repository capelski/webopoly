import { GamePhase, PropertyType, SquareType } from '../enums';
import { getCurrentPlayer, getPlayerById, getSquareById } from '../logic';
import {
  Game,
  GameAnswerOfferPhase,
  GameBuyPropertyLiquidationPhase,
  GamePendingPaymentLiquidationPhase,
  GamePlayPhase,
  GameRollDicePhase,
  Player,
  PropertySquare,
  Square,
} from '../types';

export const canAnswerOffer = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GameAnswerOfferPhase;
} | null => {
  if (game.phase !== GamePhase.answerOffer) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};

export const canTriggerBuyingOffer = (
  game: Game,
  squareId: Square['id'],
  amount: number,
  windowPlayerId: Player['id'],
): {
  game: GamePlayPhase | GameRollDicePhase;
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
    !square.ownerId ||
    square.ownerId === windowPlayerId ||
    (square.propertyType === PropertyType.street && square.houses > 0) ||
    amount <= 0
  ) {
    return null;
  }

  if (currentPlayer.money < amount) {
    return null;
  }

  return { game, property: square };
};

export const canTriggerSellingOffer = (
  game: Game,
  squareId: Square['id'],
  amount: number,
  targetPlayerId: Player['id'] | undefined,
  windowPlayerId: Player['id'],
): {
  game:
    | GameBuyPropertyLiquidationPhase
    | GamePendingPaymentLiquidationPhase
    | GamePlayPhase
    | GameRollDicePhase;
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
    !square.ownerId ||
    square.ownerId !== windowPlayerId ||
    (square.propertyType === PropertyType.street && square.houses > 0) ||
    amount <= 0 ||
    !targetPlayerId
  ) {
    return null;
  }

  const targetPlayer = getPlayerById(game, targetPlayerId);
  if (targetPlayer.money < amount) {
    return null;
  }

  return { game, property: square };
};
