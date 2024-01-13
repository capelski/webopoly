import { GameEventType, GamePhase, NotificationType } from '../enums';
import { getCurrentPlayer, getDiceRoll } from '../logic';
import { Game } from '../types';

export const triggerDiceRoll = (game: Game): Game => {
  const nextDice = getDiceRoll();
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    dice: nextDice,
    gamePhase: GamePhase.play,
    notifications: [
      {
        dice: nextDice,
        notificationType: NotificationType.silent,
        playerId: currentPlayer.id,
        type: GameEventType.rollDice,
      },
    ],
  };
};
