import { GamePhase, PromptType, TransitionType } from '../enums';
import { getDiceMovement, getDiceRoll, getNextSquareId } from '../logic';
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
    dice: getDiceRoll(),
    phase: GamePhase.uiTransition,
    transitionType: TransitionType.jailDiceRoll,
  };
};
