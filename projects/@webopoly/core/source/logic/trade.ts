import { SquareType } from '../enums';
import { Game, GameTradePhase, Player, PropertySquare } from '../types';
import { getCurrentPlayer } from './game';

export const getPropertyOwnersId = (game: Game): Player['id'][] => {
  return game.squares.reduce<Player['id'][]>((reduced, square) => {
    return square.type === SquareType.property &&
      square.ownerId &&
      !reduced.includes(square.ownerId)
      ? [...reduced, square.ownerId]
      : reduced;
  }, []);
};

export const getTradingPlayersId = (game: GameTradePhase): Player['id'][] => {
  const currentPlayer = getCurrentPlayer(game);

  const ownId = game.ownSquaresId.length > 0 ? [currentPlayer.id] : [];
  const otherId = game.other.ownerId && game.other.squaresId.length > 0 ? [game.other.ownerId] : [];

  return [...ownId, ...otherId];
};

export const isSelectedForTrade = (game: GameTradePhase, square: PropertySquare) => {
  return game.other.squaresId.includes(square.id) || game.ownSquaresId.includes(square.id);
};

export const isTradableSquare = (game: GameTradePhase, square: PropertySquare) => {
  const currentPlayer = getCurrentPlayer(game);

  return (
    square.ownerId === currentPlayer.id ||
    (game.other.ownerId ? game.other.ownerId === square.ownerId : square.ownerId)
  );
};
