import { GamePhase, LiquidationReason, PromptType, TransitionType } from '../enums';
import { Dice } from './dice';
import { PendingEvent } from './event';
import { EventMinified } from './event-minified';
import { GameUiTransitionPhase } from './game';
import { Id } from './id';
import { PlayerMinified } from './player-minified';
import { BuyPropertyPrompt, Prompt } from './prompt';
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

export type GameLiquidationPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: GamePhase.liquidation;
} & (
    | {
        /** pendingPrompt */
        pp: BuyPropertyPrompt;
        /** trigger */
        t: LiquidationReason.buyProperty;
      }
    | {
        /** pendingEvent */
        pe: PendingEvent;
        /** trigger */
        t: LiquidationReason.pendingPayment;
      }
  );

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

export type GameUiTransitionPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: GamePhase.uiTransition;
} & (
    | {
        /** transitionType */
        tt: TransitionType.dice;
      }
    | {
        /** transitionType */
        tt: TransitionType.getOutOfJail;
      }
    | {
        /** transitionType */
        tt: TransitionType.jailDiceRoll;
      }
    | {
        /** Not minifying, as it will not be persisted in the event history */
        td: GameUiTransitionPhase<TransitionType.player>['transitionData'];
        /** transitionType */
        tt: TransitionType.player;
      }
  );

export type GameMinified =
  | GameLiquidationPhaseMinified
  | GamePlayPhaseMinified
  | GamePromptPhaseMinified
  | GameRollDicePhaseMinified
  | GameUiTransitionPhaseMinified;
