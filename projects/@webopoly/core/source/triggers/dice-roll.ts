import { diceTransitionDuration } from '../constants';
import { EventType, GamePhase, GameUpdateType } from '../enums';
import {
  exceedsMaxDoublesInARow,
  getCurrentPlayer,
  getDiceMovement,
  getDiceRoll,
  getNextSquareId,
  isDoublesRoll,
} from '../logic';
import {
  Game_DiceAnimation,
  Game_DiceInJailAnimation,
  Game_JailOptions,
  Game_Play,
  Game_RollDice,
} from '../types';
import { MovePlayerOutputPhases, triggerMovePlayer } from './move-player';

export const applyDiceRoll = (game: Game_Play): MovePlayerOutputPhases => {
  const movement = getDiceMovement(game.dice);
  const nextSquareId = getNextSquareId(game, movement);
  return triggerMovePlayer(game, nextSquareId);
};

export const triggerDiceRoll = (game: Game_RollDice): Game_DiceAnimation => {
  const currentPlayer = getCurrentPlayer(game);
  const nextDice = getDiceRoll();
  const isDoubles = isDoublesRoll(nextDice);

  if (isDoubles) {
    ++currentPlayer.doublesInARow;
  } else {
    currentPlayer.doublesInARow = 0;
  }

  return {
    ...game,
    notifications:
      isDoubles && !exceedsMaxDoublesInARow(currentPlayer.doublesInARow)
        ? [
            ...game.notifications,
            {
              doublesInARow: currentPlayer.doublesInARow,
              playerId: currentPlayer.id,
              type: EventType.extraTurn,
            },
          ]
        : game.notifications,
    defaultAction: {
      interval: diceTransitionDuration * 2 * 1000,
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.postDice },
    },
    dice: nextDice,
    phase: GamePhase.diceAnimation,
  };
};

export const triggerDiceRollInJail = (game: Game_JailOptions): Game_DiceInJailAnimation => {
  return {
    ...game,
    defaultAction: {
      interval: diceTransitionDuration * 2 * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.postDiceInJail },
    },
    dice: getDiceRoll(),
    phase: GamePhase.diceInJailAnimation,
  };
};
