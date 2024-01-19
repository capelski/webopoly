import { ChangeType, UiUpdateType } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game } from '../types';

export const triggerEndTurn = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    uiUpdates: [
      {
        playerId: currentPlayer.id,
        type: ChangeType.endTurn,
        uiUpdateType: UiUpdateType.silent,
      },
    ],
  };
};
