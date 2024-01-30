import { GamePhase, JailMedium } from '../enums';
import { getDiceRoll, getNextSquareId, isDoublesRoll } from '../logic';
import { Game } from '../types';
import { triggerGetOutOfJail, triggerTurnInJail } from './jail';
import { triggerMovePlayer } from './move-player';

export const applyDiceRoll = (game: Game): Game => {
  const movement = game.dice.reduce((x, y) => x + y, 0);
  const nextSquareId = getNextSquareId(game, movement);
  return triggerMovePlayer(game, nextSquareId);
};

export const triggerDiceRoll = (game: Game, isInJail = false): Game => {
  let nextGame: Game = { ...game, dice: getDiceRoll(), status: GamePhase.play };

  if (isInJail) {
    const isDoubles = isDoublesRoll(nextGame.dice);

    if (isDoubles) {
      nextGame = triggerGetOutOfJail(nextGame, JailMedium.dice);
    } else {
      nextGame = triggerTurnInJail(nextGame);
    }
  } else {
    nextGame = applyDiceRoll(nextGame);
  }

  return nextGame;
};
