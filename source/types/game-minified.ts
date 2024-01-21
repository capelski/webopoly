import { ChangeMinified } from './change-minified';
import { Dice } from './dice';
import { Id } from './id';
import { PlayerMinified } from './player-minified';
import { SquareMinified } from './square-minified';
import { UiUpdate } from './ui-update';

export type GameMinified = {
  /** centerPot */
  cp: number;
  /** changeHistory */
  ch: ChangeMinified[];
  /** currentPlayerId */
  ci: Id;
  /** dice */
  d: Dice;
  /** players */
  p: PlayerMinified[];
  /** squares */
  s: SquareMinified[];
  /** uiUpdates */
  u: UiUpdate[];
};
