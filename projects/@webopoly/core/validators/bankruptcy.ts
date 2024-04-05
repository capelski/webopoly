import { GamePhase, PromptType } from '../enums';
import { castPromptGame, getCurrentPlayer } from '../logic';
import { Game, GamePromptPhase, Player } from '../types';

export const canDeclareBankruptcy = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GamePromptPhase<PromptType.cannotPay>;
} | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.cannotPay) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
};
