import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Game_ApplyCard, Game_DrawCard, Player } from '../types';

export const canApplyCard = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: Game_ApplyCard;
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
  game: Game_DrawCard;
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
