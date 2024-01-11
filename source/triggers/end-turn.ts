import { GameEventType, NotificationType } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game } from '../types';

export const triggerEndTurn = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    notifications: [
      {
        notificationType: NotificationType.silent,
        playerId: currentPlayer.id,
        type: GameEventType.endTurn,
      },
    ],
  };
};
