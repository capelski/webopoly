import { GamePhase, PromptType } from '../enums';
import { castPromptGame, getCurrentPlayer } from '../logic';
import { Game, GamePromptPhase, Player } from '../types';

export const canApplyCard = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GamePromptPhase<PromptType.card>;
} | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.card) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
};
