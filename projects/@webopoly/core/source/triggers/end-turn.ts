import { GamePhase, GameUpdateType } from '../enums';
import {
  getActivePlayers,
  getCurrentPlayer,
  getNextPlayerId,
  getPlayerById,
  hasExtraTurn,
} from '../logic';
import {
  GameCannotPayPhase,
  GameJailOptionsPhase,
  GamePlayerWinsPhase,
  GamePlayPhase,
  GameRollDicePhase,
} from '../types';
import { canUseJailCard } from '../validators';

export type EndTurnInputPhases =
  | GamePlayPhase // A player finishes their turn
  | GameJailOptionsPhase // A player pays the jail fine to get out
  | GameCannotPayPhase; // A player declares bankruptcy

export type EndTurnOutputPhases =
  | GameRollDicePhase // Next player must start their turn and they are NOT in jail
  | GameJailOptionsPhase // Next player must start their turn and they ARE in jail
  | GamePlayerWinsPhase; // Next player must start their turn and they have won

export const triggerEndTurn = (game: EndTurnInputPhases): EndTurnOutputPhases => {
  const currentPlayer = getCurrentPlayer(game);
  if (hasExtraTurn(currentPlayer) && !currentPlayer.isInJail) {
    return {
      ...game,
      defaultAction: {
        playerId: currentPlayer.id,
        update: { type: GameUpdateType.rollDice },
      },
      phase: GamePhase.rollDice,
    };
  } else {
    currentPlayer.doublesInARow = 0;
  }

  const nextPlayerId = getNextPlayerId(game);
  const nextPlayer = getPlayerById(game, nextPlayerId);
  const remainingPlayers = getActivePlayers(game);

  if (remainingPlayers.length === 1) {
    return {
      ...game,
      currentPlayerId: nextPlayerId,
      phase: GamePhase.playerWins,
      phaseData: {
        playerId: nextPlayerId,
      },
    };
  }

  if (nextPlayer.isInJail) {
    const nextGame: GameJailOptionsPhase = {
      ...game,
      currentPlayerId: nextPlayerId,
      phase: GamePhase.jailOptions,
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
