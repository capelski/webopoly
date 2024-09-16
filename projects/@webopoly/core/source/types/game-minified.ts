import { EventMinified } from './event-minified';
import {
  Game,
  GameBuyPropertyLiquidationPhase,
  GameDiceAnimationPhase,
  GameDiceInJailAnimationPhase,
  GameOutOfJailAnimationPhase,
  GamePendingPaymentLiquidationPhase,
  GamePlayerAnimationPhase,
  GamePlayPhase,
  GameRollDicePhase,
} from './game';
import { PromptPhasePayload, TradePhasePayload } from './game-phase-payload';
import { PlayerMinified } from './player-minified';
import { SquareMinified } from './square-minified';

type GameBaseMinified = {
  /** centerPot */
  cp: Game['centerPot'];
  /** currentPlayerId */
  ci: Game['currentPlayerId'];
  /** dice */
  d: Game['dice'];
  /** defaultAction */
  da: Game['defaultAction'];
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

export type GameBuyPropertyLiquidationPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: GameBuyPropertyLiquidationPhase['phase'];
  /** pendingPrompt */
  pp: GameBuyPropertyLiquidationPhase['pendingPrompt'];
};

export type GamePendingPaymentLiquidationPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: GamePendingPaymentLiquidationPhase['phase'];
  /** pendingEvent */
  pe: GamePendingPaymentLiquidationPhase['pendingEvent'];
};

export type GamePlayerAnimationPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: GamePlayerAnimationPhase['phase'];
  /** Not minifying, as it will not be persisted in the event history */
  a: GamePlayerAnimationPhase['animation'];
};

export type GamePromptPhaseMinified = GameBaseMinified & {
  /** phase */
  ph: PromptPhasePayload['phase'];
  /** prompt */
  pr: PromptPhasePayload['prompt'];
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

export type GenericGamePhaseMinified = GameBaseMinified & {
  /** phase */
  ph:
    | GameDiceAnimationPhase['phase']
    | GameDiceInJailAnimationPhase['phase']
    | GameOutOfJailAnimationPhase['phase']
    | GamePlayPhase['phase']
    | GameRollDicePhase['phase'];
};

export type GameMinified =
  | GameBuyPropertyLiquidationPhaseMinified
  | GamePendingPaymentLiquidationPhaseMinified
  | GamePlayerAnimationPhaseMinified
  | GamePromptPhaseMinified
  | GameTradePhaseMinified
  | GenericGamePhaseMinified;
