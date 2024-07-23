import { GamePhase, LiquidationReason, PromptType, SquareType } from '../enums';
import { castPromptGame, getCurrentPlayer, getPlayerById, getSquareById } from '../logic';
import {
  Game,
  GameLiquidationPhase,
  GamePlayPhase,
  GamePromptPhase,
  GameRollDicePhase,
  Player,
  PropertySquare,
  Square,
} from '../types';

export const canAnswerOffer = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GamePromptPhase<PromptType.answerOffer>;
} | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.answerOffer) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
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
  if (square.type !== SquareType.property || !square.ownerId || amount <= 0) {
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
  game: GameLiquidationPhase<LiquidationReason> | GamePlayPhase | GameRollDicePhase;
  property: PropertySquare;
} | null => {
  if (
    game.phase !== GamePhase.liquidation &&
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
  if (square.type !== SquareType.property || !square.ownerId || amount <= 0 || !targetPlayerId) {
    return null;
  }

  const targetPlayer = getPlayerById(game, targetPlayerId);
  if (targetPlayer.money < amount) {
    return null;
  }

  return { game, property: square };
};
