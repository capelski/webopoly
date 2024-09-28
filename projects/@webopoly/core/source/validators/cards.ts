import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Player } from '../types';

export const canApplyCard = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.applyCard>;
} | null => {
  if (game.phase !== GamePhase.applyCard) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};

export const canDrawCard = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.drawCard>;
} | null => {
  if (game.phase !== GamePhase.drawCard) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};
