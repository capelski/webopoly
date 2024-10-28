import { GamePhase, SquareType } from '../enums';
import {
  getCurrentPlayer,
  getPropertyOwnersId,
  getSquareById,
  getTradingPlayersId,
  isTradableSquare,
} from '../logic';
import { Game, Player, PropertySquare, Square } from '../types';

export const canAnswerTrade = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.answerTrade_play> | Game<GamePhase.answerTrade_rollDice>;
} | null => {
  if (game.phase !== GamePhase.answerTrade_play && game.phase !== GamePhase.answerTrade_rollDice) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};

export const canCancelTrade = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.trade_play> | Game<GamePhase.trade_rollDice>;
} | null => {
  if (game.phase !== GamePhase.trade_play && game.phase !== GamePhase.trade_rollDice) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};

export const canStartTrade = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.play> | Game<GamePhase.rollDice>;
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
  game: Game<any>,
  squareId: Square['id'],
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.trade_play> | Game<GamePhase.trade_rollDice>;
  property: PropertySquare;
} | null => {
  if (game.phase !== GamePhase.trade_play && game.phase !== GamePhase.trade_rollDice) {
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
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.trade_play> | Game<GamePhase.trade_rollDice>;
} | null => {
  if (game.phase !== GamePhase.trade_play && game.phase !== GamePhase.trade_rollDice) {
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
