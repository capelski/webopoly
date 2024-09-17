import { jailFine } from '../constants';
import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import {
  Game,
  GameApplyCardPhase,
  GameGoToJailPhase,
  GameJailOptionsPhase,
  Player,
} from '../types';

export const canPayJailFine = (
  game: Game,
  windowPlayerId: Player['id'],
): { game: GameJailOptionsPhase } | null => {
  if (game.phase !== GamePhase.jailOptions) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  if (currentPlayer.money < jailFine || currentPlayer.turnsInJail === 2) {
    return null;
  }

  return { game };
};

export const canRollDiceInJail = (
  game: Game,
  windowPlayerId: Player['id'],
): { game: GameJailOptionsPhase } | null => {
  if (game.phase !== GamePhase.jailOptions) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};

export const canUseJailCard = (
  game: Game,
  windowPlayerId: Player['id'],
): { game: GameJailOptionsPhase } | null => {
  if (game.phase !== GamePhase.jailOptions) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  if (currentPlayer.getOutOfJail === 0) {
    return null;
  }

  return { game };
};

export const mustGoToJail = (
  game: Game,
  windowPlayerId: Player['id'],
): {
  game: GameApplyCardPhase | GameGoToJailPhase;
} | null => {
  if (game.phase !== GamePhase.applyCard && game.phase !== GamePhase.goToJail) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};
