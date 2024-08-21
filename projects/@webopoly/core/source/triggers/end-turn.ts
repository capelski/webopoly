import { GamePhase, GameUpdateType, PromptType } from '../enums';
import { getActivePlayers, getNextPlayerId, getPlayerById } from '../logic';
import { GamePlayPhase, GamePromptPhase, GameRollDicePhase } from '../types';
import { canUseJailCard } from '../validators';

export type EndTurnInputPhases =
  | GamePlayPhase // A player finishes their turn
  | GamePromptPhase<PromptType.jailOptions> // A player pays the jail fine to get out
  | GamePromptPhase<PromptType.cannotPay>; // A player declares bankruptcy

export type EndTurnOutputPhases =
  | GameRollDicePhase // Next player must start their turn and they are NOT in jail
  | GamePromptPhase<PromptType.jailOptions> // Next player must start their turn and they ARE in jail
  | GamePromptPhase<PromptType.playerWins>; // Next player must start their turn and they have won

export const triggerEndTurn = (game: EndTurnInputPhases): EndTurnOutputPhases => {
  const nextPlayerId = getNextPlayerId(game);
  const nextPlayer = getPlayerById(game, nextPlayerId);
  const remainingPlayers = getActivePlayers(game);

  if (remainingPlayers.length === 1) {
    return {
      ...game,
      currentPlayerId: nextPlayerId,
      phase: GamePhase.prompt,
      prompt: {
        playerId: nextPlayerId,
        type: PromptType.playerWins,
      },
    };
  }

  if (nextPlayer.isInJail) {
    const nextGame: GamePromptPhase<PromptType.jailOptions> = {
      ...game,
      currentPlayerId: nextPlayerId,
      phase: GamePhase.prompt,
      prompt: {
        type: PromptType.jailOptions,
      },
    };

    nextGame.defaultAction = {
      playerId: nextPlayerId,
      update: {
        type: canUseJailCard(nextGame, nextPlayerId)
          ? GameUpdateType.useJailCard
          : GameUpdateType.rollDiceInJail,
      },
    };

    return nextGame;
  }

  return {
    ...game,
    currentPlayerId: nextPlayerId,
    defaultAction: {
      playerId: nextPlayerId,
      update: { type: GameUpdateType.rollDice },
    },
    phase: GamePhase.rollDice,
  };
};
