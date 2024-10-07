import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Player } from '../types';

export const canEndTurn = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game:
    | Game<GamePhase.diceInJailAnimation>
    | Game<GamePhase.outOfJailAnimation>
    | Game<GamePhase.play>;
} | null => {
  if (
    game.phase !== GamePhase.diceInJailAnimation &&
    game.phase !== GamePhase.outOfJailAnimation &&
    game.phase !== GamePhase.play
  ) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};
