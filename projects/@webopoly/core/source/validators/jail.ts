import { jailFine } from '../constants';
import { GamePhase } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Player } from '../types';

export const canPayJailFine = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): { game: Game<GamePhase.jailOptions> } | null => {
  if (game.phase !== GamePhase.jailOptions) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  if (currentPlayer.money < jailFine) {
    return null;
  }

  return { game };
};

export const canRollDiceInJail = (
  game: Game<any>,
  windowPlayerId: Player['id'],
): { game: Game<GamePhase.jailOptions> } | null => {
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
  game: Game<any>,
  windowPlayerId: Player['id'],
): { game: Game<GamePhase.jailOptions> } | null => {
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
  game: Game<any>,
  windowPlayerId: Player['id'],
): {
  game: Game<GamePhase.applyCard> | Game<GamePhase.jailNotification>;
} | null => {
  if (game.phase !== GamePhase.applyCard && game.phase !== GamePhase.jailNotification) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game };
};
