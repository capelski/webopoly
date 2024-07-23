import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, GameRollDicePhase, Player } from '../types';

export const canRollDice = (
  game: Game,
  windowPlayerId: Player['id'],
): { game: GameRollDicePhase } | null => {
  if (game.phase !== GamePhase.rollDice) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};
