import { GamePhase, PromptType } from '../enums';
import { castPromptGame, getCurrentPlayer } from '../logic';
import { Game, GamePromptPhase, Player } from '../types';

export const canApplyCard = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GamePromptPhase<PromptType.applyCard>;
} | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.applyCard) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
};

export const canDrawCard = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GamePromptPhase<PromptType.drawCard>;
} | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.drawCard) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
};
