import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, GamePlayPhase, Player } from '../types';

export const canEndTurn = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GamePlayPhase;
} | null => {
  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return game.phase === GamePhase.play ? { game } : null;
};
