import { GamePhase } from '../enums';
import { ChangeMinified } from './change-minified';
import { Dice } from './dice';
import { Id } from './id';
import { IncomingChange } from './incoming-change';
import { PlayerMinified } from './player-minified';
import { SquareMinified } from './square-minified';

export type GameMinified = {
  /** centerPot */
  cp: number;
  /** changeHistory */
  ch: ChangeMinified[];
  /** currentPlayerId */
  ci: Id;
  /** dice */
  d: Dice;
  /** gamePhase */
  g: GamePhase;
  /** incomingChanges */
  i: IncomingChange[];
  /** players */
  p: PlayerMinified[];
  /** squares */
  s: SquareMinified[];
};
