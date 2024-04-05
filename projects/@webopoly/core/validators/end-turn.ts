import { GamePhase, PromptType } from '../enums';
import { castPromptGame, getCurrentPlayer } from '../logic';
import { Game, GamePlayPhase, GamePromptPhase, Player } from '../types';

export const canEndTurn = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game:
    | GamePlayPhase
    | GamePromptPhase<PromptType.cannotPay>
    | GamePromptPhase<PromptType.jailOptions>;
} | null => {
  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return game.phase === GamePhase.play
    ? { game }
    : game.phase === GamePhase.prompt
    ? game.prompt.type === PromptType.jailOptions
      ? { game: castPromptGame(game, game.prompt) }
      : game.prompt.type === PromptType.cannotPay
      ? { game: castPromptGame(game, game.prompt) }
      : null
    : null;
};
