import { Dice } from './dice';
import { PendingEvent } from './event';
import { EventMinified } from './event-minified';
import { GamePhase } from './game-phase';
import { Id } from './id';
import { PlayerMinified } from './player-minified';
import { SquareMinified } from './square-minified';

export type GameMinified = {
  /** centerPot */
  cp: number;
  /** currentPlayerId */
  ci: Id;
  /** dice */
  d: Dice;
  /** eventHistory */
  eh: EventMinified[];
  /** nextChanceCardIds */
  nh: Id[];
  /** nextCommunityCardIds */
  no: Id[];
  /** notifications */
  n: EventMinified[];
  /** pendingEvent */
  pe: PendingEvent | undefined;
  /** phase */
  ph: GamePhase;
  /** players */
  pl: PlayerMinified[];
  /** squares */
  sq: SquareMinified[];
};
