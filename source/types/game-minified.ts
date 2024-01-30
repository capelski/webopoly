import { Dice } from './dice';
import { Id } from './id';
import { ExpenseNotification, GetOutOfJailNotification, PayRentNotification } from './notification';
import { NotificationMinified } from './notification-minified';
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
  /** mustStartTurn */
  m: boolean;
  /** nextChanceCardIds */
  nh: Id[];
  /** nextCommunityCardIds */
  no: Id[];
  /** notifications */
  n: NotificationMinified[];
  /** pastNotifications */
  pa: NotificationMinified[];
  /** pendingNotification */
  pn: ExpenseNotification | GetOutOfJailNotification | PayRentNotification | undefined;
  /** players */
  p: PlayerMinified[];
  /** prompt */
  pr: Prompt | undefined;
  /** squares */
  s: SquareMinified[];
};
