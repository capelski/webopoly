import { ChangeType, ChangeUiType } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game } from '../types';

export const triggerEndTurn = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    incomingChanges: [
      {
        playerId: currentPlayer.id,
        type: ChangeType.endTurn,
        uiType: ChangeUiType.silent,
      },
    ],
  };
};
