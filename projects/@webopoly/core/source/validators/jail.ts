import { jailFine } from '../constants';
import { GamePhase, PromptType } from '../enums';
import { castPromptGame, getCurrentPlayer } from '../logic';
import { Game, GamePromptPhase, Player } from '../types';

export const canPayJailFine = (
  game: Game,
  windowPlayerId: Player['id'],
): { game: GamePromptPhase<PromptType.jailOptions> } | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.jailOptions) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  if (currentPlayer.money < jailFine || currentPlayer.turnsInJail === 2) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
};

export const canRollDiceInJail = (
  game: Game,
  windowPlayerId: Player['id'],
): { game: GamePromptPhase<PromptType.jailOptions> } | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.jailOptions) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
};

export const canUseJailCard = (
  game: Game,
  windowPlayerId: Player['id'],
): { game: GamePromptPhase<PromptType.jailOptions> } | null => {
  if (game.phase !== GamePhase.prompt || game.prompt.type !== PromptType.jailOptions) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  if (currentPlayer.getOutOfJail === 0) {
    return null;
  }

  return { game: castPromptGame(game, game.prompt) };
};

export const mustGoToJail = (
  game: Game,
  windowPlayerId: Player['id'],
): { game: GamePromptPhase<PromptType.card> | GamePromptPhase<PromptType.goToJail> } | null => {
  if (
    game.phase !== GamePhase.prompt ||
    (game.prompt.type !== PromptType.card && game.prompt.type !== PromptType.goToJail)
  ) {
    return null;
  }

  const currentPlayer = getCurrentPlayer(game);
  if (windowPlayerId !== currentPlayer.id) {
    return null;
  }

  return game.prompt.type === PromptType.card
    ? { game: castPromptGame(game, game.prompt) }
    : { game: castPromptGame(game, game.prompt) };
};
