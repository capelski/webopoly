import { ChangeType, ChangeUiType, GamePhase } from '../enums';
import { getCurrentPlayer, getDiceRoll } from '../logic';
import { Game } from '../types';

export const triggerDiceRoll = (game: Game): Game => {
  const nextDice = getDiceRoll();
  const currentPlayer = getCurrentPlayer(game);
  return {
    ...game,
    dice: nextDice,
    gamePhase: GamePhase.play,
    incomingChanges: [
      {
        dice: nextDice,
        playerId: currentPlayer.id,
        type: ChangeType.rollDice,
        uiType: ChangeUiType.silent,
      },
    ],
  };
};
