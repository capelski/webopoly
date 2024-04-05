import { GamePhase, PromptType, SquareType } from '../enums';
import {
  castPromptGame,
  getCurrentPlayer,
  getPropertyOwnersId,
  getSquareById,
  getTradingPlayersId,
  isTradableSquare,
} from '../logic';
import {
  Game,
  GamePlayPhase,
  GamePromptPhase,
  GameRollDicePhase,
  GameTradePhase,
  Player,
  PropertySquare,
  Square,
} from '../types';

export const canAnswerTrade = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GamePromptPhase<PromptType.answerTrade>;
} | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.answerTrade) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
};

export const canCancelTrade = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GameTradePhase;
} | null => {
  if (game.phase !== GamePhase.trade) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};

export const canStartTrade = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GamePlayPhase | GameRollDicePhase;
} | null => {
  if (game.phase !== GamePhase.play && game.phase !== GamePhase.rollDice) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  const propertyOwnersId = getPropertyOwnersId(game);
  if (propertyOwnersId.length < 2 || !propertyOwnersId.includes(currentPlayer.id)) {
    return null;
  }

  return { game };
};

export const canToggleTradeSelection = (
  game: Game,
  squareId: Square['id'],
  windowPlayerId: Player['id'],
): {
  game: GameTradePhase;
  property: PropertySquare;
} | null => {
  if (game.phase !== GamePhase.trade) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  const square = getSquareById(game, squareId);
  if (square.type !== SquareType.property || !isTradableSquare(game, square)) {
    return null;
  }

  return { game, property: square };
};

export const canTriggerTradeOffer = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GameTradePhase;
} | null => {
  if (game.phase !== GamePhase.trade) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  const tradingPlayersId = getTradingPlayersId(game);
  if (tradingPlayersId.length < 2) {
    return null;
  }

  return { game };
};
