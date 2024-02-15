import { GamePhase, PromptType, TransitionType } from '../enums';
import {
  getCurrentPlayer,
  getDiceMovement,
  getDiceRoll,
  getNextSquareId,
  isDoublesRoll,
} from '../logic';
import { maxTurnsInJail } from '../parameters';
import { GamePlayPhase, GamePromptPhase, GameRollDicePhase, GameUiTransitionPhase } from '../types';
import { triggerLastTurnInJail, triggerRemainInJail, triggerRollDoublesInJail } from './jail';
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
): GamePlayPhase | MovePlayerOutputPhases => {
  const nextGame: GamePromptPhase<PromptType.jailOptions> = {
    ...game,
    dice: getDiceRoll(),
  };

  const isDoubles = isDoublesRoll(nextGame.dice);
  if (isDoubles) {
    return triggerRollDoublesInJail(nextGame);
  }

  const currentPlayer = getCurrentPlayer(nextGame);
  const { turnsInJail } = currentPlayer;

  return turnsInJail === maxTurnsInJail - 1
    ? triggerLastTurnInJail(nextGame)
    : triggerRemainInJail(nextGame);
};
