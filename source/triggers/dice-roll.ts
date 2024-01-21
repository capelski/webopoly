import { ChangeType, UiUpdateType } from '../enums';
import { getCurrentPlayer, getDiceRoll } from '../logic';
import { Game } from '../types';

export const triggerDiceRoll = (game: Game): Game => {
  const nextDice = getDiceRoll();
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    dice: nextDice,
    uiUpdates: [
      {
        playerId: currentPlayer.id,
        type: ChangeType.rollDice,
        uiUpdateType: UiUpdateType.silent,
      },
    ],
  };
};
