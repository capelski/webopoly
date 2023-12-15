import { GameEventType, TurnPhase } from '../enums';
import { Game } from '../types';

export const endTurn = (game: Game): Game => {
  return {
    ...game,
    currentPlayer: (game.currentPlayer + 1) % game.players.length,
    turnPhase: TurnPhase.start,
    events: [
      {
        description: `Player ${game.currentPlayer + 1} ends its turn`,
        type: GameEventType.endTurn,
      },
    ].concat(game.events),
  };
};
