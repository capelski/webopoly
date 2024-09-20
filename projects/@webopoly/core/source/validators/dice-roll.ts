import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Game_RollDice, Player } from '../types';

export const canRollDice = (
  game: Game,
  windowPlayerId: Player['id'],
): { game: Game_RollDice } | null => {
  if (game.phase !== GamePhase.rollDice) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};
