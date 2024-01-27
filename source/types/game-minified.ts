import { Dice } from './dice';
import { Id } from './id';
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
  /** players */
  p: PlayerMinified[];
  /** prompt */
  pr: Prompt | undefined;
  /** squares */
  s: SquareMinified[];
};
