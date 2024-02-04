import { GamePhase, PromptType } from '../enums';
import { getActivePlayers, getNextPlayerId, getPlayerById } from '../logic';
import { GamePlayPhase, GamePromptPhase, GameRollDicePhase } from '../types';

export type EndTurnInputPhases =
  | GamePlayPhase // A player finishes their turn
  | GamePromptPhase<PromptType.cannotPay>; // A player declares bankruptcy

export type EndTurnOutputPhases =
  | GameRollDicePhase // Next player must start their turn and they are NOT in jail
  | GamePromptPhase<PromptType.jailOptions> // Next player must start their turn and they ARE in jail
  | GamePromptPhase<PromptType.playerWins>; // Next player must start their turn and they have won

export const triggerEndTurn = (game: EndTurnInputPhases): EndTurnOutputPhases => {
  const nextPlayerId = getNextPlayerId(game);
  const nextPlayer = getPlayerById(game, nextPlayerId);
  const remainingPlayers = getActivePlayers(game);

  const nextGame: EndTurnInputPhases = {
    ...game,
    currentPlayerId: nextPlayerId,
  };

  return remainingPlayers.length === 1
    ? {
        ...nextGame,
        phase: GamePhase.prompt,
        prompt: {
          playerId: nextPlayerId,
          type: PromptType.playerWins,
        },
      }
    : nextPlayer.isInJail
    ? {
        ...nextGame,
        phase: GamePhase.prompt,
        prompt: {
          type: PromptType.jailOptions,
        },
      }
    : {
        ...nextGame,
        phase: GamePhase.rollDice,
      };
};
