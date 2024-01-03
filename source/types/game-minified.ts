import { GamePhase } from '../enums';
import { Dice } from './dice';
import { EventNotification } from './event-notification';
import { GameEventMinified } from './game-event-minified';
import { Id } from './id';
import { PlayerMinified } from './player-minified';
import { SquareMinified } from './square';

export type GameMinified = {
  /** centerPot */
  cp: number;
  /** currentPlayerId */
  ci: Id;
  /** dice */
  d: Dice;
  /** events */
  e: GameEventMinified[];
  /** gamePhase */
  g: GamePhase;
  /** notifications */
  n: EventNotification[];
  /** players */
  p: PlayerMinified[];
  /** squares */
  s: SquareMinified[];
};
