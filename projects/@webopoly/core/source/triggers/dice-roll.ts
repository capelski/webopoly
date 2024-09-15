import { diceTransitionDuration } from '../constants';
import { EventType, GamePhase, GameUpdateType, PromptType, TransitionType } from '../enums';
import {
  exceedsMaxDoublesInARow,
  getCurrentPlayer,
  getDiceMovement,
  getDiceRoll,
  getNextSquareId,
  isDoublesRoll,
} from '../logic';
import { GamePlayPhase, GamePromptPhase, GameRollDicePhase, GameUiTransitionPhase } from '../types';
import { MovePlayerOutputPhases, triggerMovePlayer } from './move-player';

export const applyDiceRoll = (game: GamePlayPhase): MovePlayerOutputPhases => {
  const movement = getDiceMovement(game.dice);
  const nextSquareId = getNextSquareId(game, movement);
  return triggerMovePlayer(game, nextSquareId);
};

export const triggerDiceRoll = (
  game: GameRollDicePhase,
): GameUiTransitionPhase<TransitionType.dice> => {
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
    phase: GamePhase.uiTransition,
    transitionType: TransitionType.dice,
  };
};

export const triggerDiceRollInJail = (
  game: GamePromptPhase<PromptType.jailOptions>,
): GameUiTransitionPhase<TransitionType.jailDiceRoll> => {
  return {
    ...game,
    defaultAction: {
      interval: diceTransitionDuration * 2 * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.postDiceInJail },
    },
    dice: getDiceRoll(),
    phase: GamePhase.uiTransition,
    transitionType: TransitionType.jailDiceRoll,
  };
};
