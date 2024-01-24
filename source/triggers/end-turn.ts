import { PromptType } from '../enums';
import { getNextPlayerId, getPlayerById, isPlayerInJail } from '../logic';
import { Game } from '../types';

export const triggerEndTurn = (game: Game): Game => {
  const nextPlayerId = getNextPlayerId(game);
  const nextPlayer = getPlayerById(game, nextPlayerId);
  const isNextPlayerInJail = isPlayerInJail(nextPlayer);

  return {
    ...game,
    currentPlayerId: nextPlayerId,
    mustStartTurn: true,
    prompt: isNextPlayerInJail
      ? {
          hasRolledDice: false,
          type: PromptType.jailOptions,
        }
      : undefined,
  };
};
