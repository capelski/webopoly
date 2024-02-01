import { GamePhaseName, PromptType } from '../enums';
import { getActivePlayers, getNextPlayerId, getPlayerById } from '../logic';
import { Game } from '../types';

export const triggerEndTurn = (game: Game): Game => {
  const nextPlayerId = getNextPlayerId(game);
  const nextPlayer = getPlayerById(game, nextPlayerId);
  const remainingPlayers = getActivePlayers(game);

  return {
    ...game,
    currentPlayerId: nextPlayerId,
    phase:
      remainingPlayers.length === 1
        ? {
            name: GamePhaseName.prompt,
            prompt: {
              playerId: nextPlayerId,
              type: PromptType.playerWins,
            },
          }
        : nextPlayer.isInJail
        ? {
            name: GamePhaseName.prompt,
            prompt: {
              type: PromptType.jailOptions,
            },
          }
        : { name: GamePhaseName.rollDice },
  };
};
