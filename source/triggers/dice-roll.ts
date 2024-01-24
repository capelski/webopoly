import { PromptType } from '../enums';
import { getDiceRoll, getNextSquareId } from '../logic';
import { Game } from '../types';
import { triggerMovePlayer } from './move-player';

export const applyDiceRoll = (game: Game): Game => {
  const movement = game.dice.reduce((x, y) => x + y, 0);
  const nextSquareId = getNextSquareId(game, movement);
  return triggerMovePlayer(game, nextSquareId);
};

export const triggerDiceRoll = (game: Game, isInJail = false): Game => {
  let nextGame: Game = { ...game, dice: getDiceRoll(), mustStartTurn: false };

  if (isInJail) {
    nextGame.prompt = {
      hasRolledDice: true,
      type: PromptType.jailOptions,
    };
  } else {
    nextGame = applyDiceRoll(nextGame);
  }

  return nextGame;
};
