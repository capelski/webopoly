import { GamePhase } from '../enums';
import { getNextPlayerId } from '../logic';
import { Game } from '../types';

export const endTurn = (game: Game): Game => {
  return {
    ...game,
    currentPlayerId: getNextPlayerId(game),
    gamePhase: GamePhase.rollDice,
  };
};
