import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Player } from '../types';

export const canRollDice = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): { game: Game<GamePhase.rollDice> } | null => {
  if (game.phase !== GamePhase.rollDice) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};
