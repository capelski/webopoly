import { getDiceRoll, getNextSquareId } from '../logic';
import { Game } from '../types';
import { triggerMovePlayer } from './move-player';

export const triggerDiceRoll = (game: Game): Game => {
  const nextDice = getDiceRoll();
  const movement = nextDice.reduce((x, y) => x + y, 0);
  const nextSquareId = getNextSquareId(game, movement);
  const nextGame = { ...game, dice: nextDice };
  return triggerMovePlayer(nextGame, nextSquareId);
};
