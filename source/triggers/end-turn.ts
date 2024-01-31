import { GamePhase, PromptType } from '../enums';
import { getActivePlayers, getNextPlayerId, getPlayerById } from '../logic';
import { Game } from '../types';

export const triggerEndTurn = (game: Game): Game => {
  const nextPlayerId = getNextPlayerId(game);
  const nextPlayer = getPlayerById(game, nextPlayerId);
  const remainingPlayers = getActivePlayers(game);

  return {
    ...game,
    currentPlayerId: nextPlayerId,
    status:
      remainingPlayers.length === 1
        ? {
            playerId: nextPlayerId,
            type: PromptType.playerWins,
          }
        : nextPlayer.isInJail
        ? {
            type: PromptType.jailOptions,
          }
        : GamePhase.rollDice,
  };
};
