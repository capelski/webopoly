import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Game_Play, Player } from '../types';

export const canEndTurn = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: Game_Play;
} | null => {
  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return game.phase === GamePhase.play ? { game } : null;
};
