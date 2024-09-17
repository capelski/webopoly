import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, GameApplyCardPhase, GameDrawCardPhase, Player } from '../types';

export const canApplyCard = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GameApplyCardPhase;
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
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GameDrawCardPhase;
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
