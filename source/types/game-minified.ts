import { GamePhase } from '../enums';
import { Dice } from './dice';
import { ExpenseEvent, GetOutOfJailEvent, PayRentEvent } from './event';
import { EventMinified } from './event-minified';
import { Id } from './id';
import { PlayerMinified } from './player-minified';
import { Prompt } from './prompt';
import { SquareMinified } from './square-minified';

export type GameMinified = {
  /** centerPot */
  cp: number;
  /** currentPlayerId */
  ci: Id;
  /** dice */
  d: Dice;
  /** nextChanceCardIds */
  nh: Id[];
  /** nextCommunityCardIds */
  no: Id[];
  /** notifications */
  n: EventMinified[];
  /** pastNotifications */
  pa: EventMinified[];
  /** pendingNotification */
  pn: ExpenseEvent | GetOutOfJailEvent | PayRentEvent | undefined;
  /** players */
  pl: PlayerMinified[];
  /** squares */
  sq: SquareMinified[];
  /** status */
  st: GamePhase | Prompt;
};
