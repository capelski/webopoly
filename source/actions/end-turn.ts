import { GameEventType, TurnPhase } from '../enums';
import { getCurrentPlayer, getNextPlayerId } from '../logic';
import { Game, GameEvent } from '../types';

export const endTurn = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    currentPlayerId: getNextPlayerId(game),
    turnPhase: TurnPhase.rollDice,
    events: [
      <GameEvent>{
        description: `${currentPlayer.name} ends its turn`,
        type: GameEventType.endTurn,
      },
    ].concat(game.events),
  };
};
