import { PromptType } from '../enums';
import { getNextPlayerId } from '../logic';
import { Game } from '../types';

export const triggerEndTurn = (game: Game): Game => {
  const nextPlayerId = getNextPlayerId(game);
  return {
    ...game,
    currentPlayerId: nextPlayerId,
    prompt: {
      playerId: nextPlayerId,
      type: PromptType.rollDice,
    },
  };
};
