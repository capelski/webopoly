import { ChangeType, PromptType, UiUpdateType } from '../enums';
import { getNextPlayerId } from '../logic';
import { Game } from '../types';

export const triggerEndTurn = (game: Game): Game => {
  const nextPlayerId = getNextPlayerId(game);
  return {
    ...game,
    currentPlayerId: nextPlayerId,
    uiUpdates: [
      {
        playerId: nextPlayerId,
        promptType: PromptType.rollDice,
        type: ChangeType.rollDice,
        uiUpdateType: UiUpdateType.prompt,
      },
    ],
  };
};
