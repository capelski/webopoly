import { GamePhase, SquareType } from '../enums';
import { Game, Player, PropertySquare } from '../types';
import { getCurrentPlayer } from './game';

export const getPropertyOwnersId = (game: Game<any>): Player['id'][] => {
  return game.squares.reduce<Player['id'][]>((reduced, square) => {
    return square.type === SquareType.property &&
      square.ownerId &&
      !reduced.includes(square.ownerId)
      ? [...reduced, square.ownerId]
      : reduced;
  }, []);
};

export const getTradingPlayersId = (
  game: Game<GamePhase.trade_play> | Game<GamePhase.trade_rollDice>,
): Player['id'][] => {
  const currentPlayer = getCurrentPlayer(game);

  const ownId = game.phaseData.ownSquaresId.length > 0 ? [currentPlayer.id] : [];
  const otherId =
    game.phaseData.other.ownerId && game.phaseData.other.squaresId.length > 0
      ? [game.phaseData.other.ownerId]
      : [];

  return [...ownId, ...otherId];
};

export const isSelectedForTrade = (
  game: Game<GamePhase.trade_play> | Game<GamePhase.trade_rollDice>,
  square: PropertySquare,
) => {
  return (
    game.phaseData.other.squaresId.includes(square.id) ||
    game.phaseData.ownSquaresId.includes(square.id)
  );
};

export const isTradableSquare = (
  game: Game<GamePhase.trade_play> | Game<GamePhase.trade_rollDice>,
  square: PropertySquare,
) => {
  const currentPlayer = getCurrentPlayer(game);

  return (
    square.ownerId === currentPlayer.id ||
    (game.phaseData.other.ownerId
      ? game.phaseData.other.ownerId === square.ownerId
      : square.ownerId)
  );
};
