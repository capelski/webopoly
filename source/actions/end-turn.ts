import { GameEventType, TurnPhase } from '../enums';
import { getCurrentPlayer, getNextPlayerId } from '../logic';
import { Game } from '../types';

export const endTurn = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    currentPlayerId: getNextPlayerId(game),
    turnPhase: TurnPhase.start,
    events: [
      {
        description: `${currentPlayer.name} ends its turn`,
        type: GameEventType.endTurn,
      },
    ].concat(game.events),
  };
};
