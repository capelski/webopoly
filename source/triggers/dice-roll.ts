import { getDiceRoll, getNextSquareId } from '../logic';
import { Game } from '../types';
import { triggerMovePlayer } from './move-player';

export const triggerDiceRoll = (game: Game): Game => {
  const nextDice = getDiceRoll();
  const movement = nextDice.reduce((x, y) => x + y, 0);
  const nextSquareId = getNextSquareId(game, movement);
  const nextGame: Game = { ...game, dice: nextDice, mustRollDice: false };
  return triggerMovePlayer(nextGame, nextSquareId);
};
