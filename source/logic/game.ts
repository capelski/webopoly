import { PlayerStatus } from '../enums';
import { Game, Id, Player, Square } from '../types';

export const getCurrentPlayer = (game: Game): Player => {
  return game.players.find((p) => p.id === game.currentPlayerId)!;
};

export const getCurrentSquare = (game: Game): Square => {
  const currentPlayer = getCurrentPlayer(game);
  return game.squares.find((s) => s.id === currentPlayer.squareId)!;
};

export const getNextPlayerId = (game: Game) => {
  const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentPlayerId);
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
  const playersPool = game.players
    .slice(nextPlayerIndex)
    .concat(game.players.slice(0, nextPlayerIndex));

  return playersPool.find((p) => p.status === PlayerStatus.playing)!.id;
};

export const getNextSquareId = (game: Game, movement: number) => {
  const currentSquare = getCurrentSquare(game);
  const currentSquareIndex = game.squares.findIndex((s) => s.id === currentSquare.id);
  const nextSquareIndex = (currentSquareIndex + movement) % game.squares.length;
  return game.squares[nextSquareIndex].id;
};

export const getPlayerById = (game: Game, playerId: Id): Player => {
  return game.players.find((p) => p.id === playerId)!;
};

export const getSquareById = (game: Game, squareId: Id): Square => {
  return game.squares.find((s) => s.id === squareId)!;
};

// TODO Function to dehydrate/re-hydrate games
