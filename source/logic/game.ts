import { PlayerStatus } from '../enums';
import { Game, Player, Square } from '../types';

export const getCurrentPlayer = (game: Game): Player =>
  game.players.find((p) => p.id === game.currentPlayerId)!;

export const getCurrentSquare = (game: Game): Square =>
  game.squares[getCurrentPlayer(game).position];

export const getNextPlayerId = (game: Game) => {
  const currentPlayerIndex = game.players.findIndex((p) => p.id === game.currentPlayerId);
  const nextPlayerIndex = (currentPlayerIndex + 1) % game.players.length;
  const playersPool = game.players
    .slice(nextPlayerIndex)
    .concat(game.players.slice(0, nextPlayerIndex));

  return playersPool.find((p) => p.status === PlayerStatus.playing)!.id;
};

export const getPlayerById = (game: Game, playerId: number): Player =>
  game.players.find((p) => p.id === playerId)!;

// TODO Function to dehydrate/re-hydrate games
