import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Player } from '../types';

export const canEndTurn = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.play>;
} | null => {
  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return game.phase === GamePhase.play ? { game } : null;
};
