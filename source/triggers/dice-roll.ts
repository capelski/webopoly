import { GamePhase, PromptType } from '../enums';
import { getCurrentPlayer, getDiceRoll, getNextSquareId, isDoublesRoll } from '../logic';
import { maxTurnsInJail } from '../parameters';
import { GamePlayPhase, GamePromptPhase, GameRollDicePhase } from '../types';
import { triggerLastTurnInJail, triggerRemainInJail, triggerRollDoublesInJail } from './jail';
import { MovePlayerOutputPhases, triggerMovePlayer } from './move-player';

export const applyDiceRoll = (game: GamePlayPhase): MovePlayerOutputPhases => {
  const movement = game.dice.reduce((x, y) => x + y, 0);
  const nextSquareId = getNextSquareId(game, movement);
  return triggerMovePlayer(game, nextSquareId);
};

export const triggerDiceRoll = (game: GameRollDicePhase): MovePlayerOutputPhases => {
  const nextGame: GamePlayPhase = {
    ...game,
    dice: getDiceRoll(),
    phase: GamePhase.play,
  };

  return applyDiceRoll(nextGame);
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
