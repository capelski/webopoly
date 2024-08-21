import { diceTransitionDuration } from '../constants';
import { GamePhase, GameUpdateType, PromptType, TransitionType } from '../enums';
import { getCurrentPlayer, getDiceMovement, getDiceRoll, getNextSquareId } from '../logic';
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
  return {
    ...game,
    defaultAction: {
      interval: diceTransitionDuration * 2 * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.postDice },
    },
    dice: getDiceRoll(),
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
