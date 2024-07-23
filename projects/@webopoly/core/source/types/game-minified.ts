import { LiquidationReason, TransitionType } from '../enums';
import { EventMinified } from './event-minified';
import { Game } from './game';
import {
  LiquidationPhasePayload,
  PlayPhasePayload,
  PromptPhasePayload,
  RollDicePhasePayload,
  TradePhasePayload,
  UiTransitionPhasePayload,
} from './game-phase-payload';
import { PlayerMinified } from './player-minified';
import { SquareMinified } from './square-minified';

type GameBaseMinified = {
  /** centerPot */
  cp: Game['centerPot'];
  /** currentPlayerId */
  ci: Game['currentPlayerId'];
  /** dice */
  d: Game['dice'];
  /** eventHistory */
  eh: EventMinified[];
  /** nextCardIds */
  nci: Game['nextCardIds'];
  /** notifications */
  n: EventMinified[];
  /** players */
  pl: PlayerMinified[];
  /** squares */
  sq: SquareMinified[];
};

export type GameLiquidationPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: LiquidationPhasePayload['phase'];
} & (
    | {
        /** pendingPrompt */
        pp: LiquidationPhasePayload<LiquidationReason.buyProperty>['pendingPrompt'];
        /** reason */
        r: LiquidationPhasePayload<LiquidationReason.buyProperty>['reason'];
      }
    | {
        /** pendingEvent */
        pe: LiquidationPhasePayload<LiquidationReason.pendingPayment>['pendingEvent'];
        /** reason */
        r: LiquidationPhasePayload<LiquidationReason.pendingPayment>['reason'];
      }
  );

export type GamePlayPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: PlayPhasePayload['phase'];
};

export type GamePromptPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: PromptPhasePayload['phase'];
  /** prompt */
  pr: PromptPhasePayload['prompt'];
};

export type GameRollDicePhaseMinified = GameBaseMinified & {
  /** phase */
  ph: RollDicePhasePayload['phase'];
};

export type GameTradePhaseMinified = GameBaseMinified & {
  /** other */
  ot: TradePhasePayload['other'];
  /** ownSquaresId */
  ows: TradePhasePayload['ownSquaresId'];
  /** phase */
  ph: TradePhasePayload['phase'];
  /** previousPhase */
  pp: TradePhasePayload['previousPhase'];
};

export type GameUiTransitionPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: UiTransitionPhasePayload['phase'];
} & (
    | {
        /** transitionType */
        tt: UiTransitionPhasePayload<TransitionType.dice>['transitionType'];
      }
    | {
        /** transitionType */
        tt: UiTransitionPhasePayload<TransitionType.getOutOfJail>['transitionType'];
      }
    | {
        /** transitionType */
        tt: UiTransitionPhasePayload<TransitionType.jailDiceRoll>['transitionType'];
      }
    | {
        /** Not minifying, as it will not be persisted in the event history */
        td: UiTransitionPhasePayload<TransitionType.player>['transitionData'];
        /** transitionType */
        tt: UiTransitionPhasePayload<TransitionType.player>['transitionType'];
      }
  );

export type GameMinified =
  | GameLiquidationPhaseMinified
  | GamePlayPhaseMinified
  | GamePromptPhaseMinified
  | GameRollDicePhaseMinified
  | GameTradePhaseMinified
  | GameUiTransitionPhaseMinified;
