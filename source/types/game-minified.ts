import { GamePhase, PromptType } from '../enums';
import { Dice } from './dice';
import { PendingEvent } from './event';
import { EventMinified } from './event-minified';
import { Id } from './id';
import { PlayerMinified } from './player-minified';
import { Prompt } from './prompt';
import { SquareMinified } from './square-minified';

type GameBaseMinified = {
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
  /** players */
  pl: PlayerMinified[];
  /** squares */
  sq: SquareMinified[];
};

export type GameCannotPayPhaseMinified = GameBaseMinified & {
  /** pendingEvent */
  pe: PendingEvent;
  /** phase */
  ph: GamePhase.cannotPay;
};

export type GamePlayPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: GamePhase.play;
};

export type GamePromptPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: GamePhase.prompt;
  /** prompt */
  pr: Prompt<PromptType>;
};

export type GameRollDicePhaseMinified = GameBaseMinified & {
  /** phase */
  ph: GamePhase.rollDice;
};

export type GameMinified =
  | GameCannotPayPhaseMinified
  | GamePlayPhaseMinified
  | GamePromptPhaseMinified
  | GameRollDicePhaseMinified;
