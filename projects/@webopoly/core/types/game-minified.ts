import { GamePhase, LiquidationReason, PromptType, TransitionType } from '../enums';
import { Card } from './card';
import { Dice } from './dice';
import { PendingEvent } from './event';
import { EventMinified } from './event-minified';
import { GameUiTransitionPhase } from './game';
import { TradePhasePayload } from './game-phase-payload';
import { Player } from './player';
import { PlayerMinified } from './player-minified';
import { BuyPropertyPrompt, Prompt } from './prompt';
import { Square } from './square';
import { SquareMinified } from './square-minified';

type GameBaseMinified = {
  /** centerPot */
  cp: number;
  /** currentPlayerId */
  ci: Player['id'];
  /** dice */
  d: Dice;
  /** eventHistory */
  eh: EventMinified[];
  /** nextCardIds */
  nci: Card['id'][];
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

export type GameTradePhaseMinified = GameBaseMinified & {
  /** other */
  ot: TradePhasePayload['other'];
  /** ownSquaresId */
  ows: Square['id'][];
  /** phase */
  ph: GamePhase.trade;
  /** previousPhase */
  pp: TradePhasePayload['previousPhase'];
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
  | GameTradePhaseMinified
  | GameUiTransitionPhaseMinified;
