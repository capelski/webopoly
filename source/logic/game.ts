import { Game } from '../types/game';

export const getCurrentPlayer = (game: Game) => game.players[game.currentPlayer];

export const getCurrentSquare = (game: Game) =>
  game && game.squares[getCurrentPlayer(game).position];
