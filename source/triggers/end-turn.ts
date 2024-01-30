import { GamePhase, PromptType } from '../enums';
import { getNextPlayerId, getPlayerById } from '../logic';
import { Game } from '../types';

export const triggerEndTurn = (game: Game): Game => {
  const nextPlayerId = getNextPlayerId(game);
  const nextPlayer = getPlayerById(game, nextPlayerId);

  return {
    ...game,
    currentPlayerId: nextPlayerId,
    status: nextPlayer.isInJail
      ? {
          type: PromptType.jailOptions,
        }
      : GamePhase.rollDice,
  };
};
