import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Game_CannotPay, Player } from '../types';

export const canDeclareBankruptcy = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: Game_CannotPay;
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
