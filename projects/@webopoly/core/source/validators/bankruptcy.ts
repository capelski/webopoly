import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Player } from '../types';

export const canDeclareBankruptcy = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.cannotPay>;
} | null => {
  if (game.phase !== GamePhase.cannotPay) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};
