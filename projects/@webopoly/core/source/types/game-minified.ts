import { GamePhase } from '../enums';
import { EventMinified } from './event-minified';
import {
  Game,
  GameAnswerOfferPhase,
  GameAnswerTradePhase,
  GameApplyCardPhase,
  GameBuyPropertyLiquidationPhase,
  GameBuyPropertyPhase,
  GameCannotPayPhase,
  GamePendingPaymentLiquidationPhase,
  GamePlayerAnimationPhase,
  GamePlayerWinsPhase,
  GameTradePhase,
} from './game';
import { PlayerMinified } from './player-minified';
import { SquareMinified } from './square-minified';

type GameBaseMinified<TPhase extends GamePhase> = {
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
  /** phase */
  ph: TPhase;
  /** players */
  pl: PlayerMinified[];
  /** squares */
  sq: SquareMinified[];
};

export type GameAnswerOfferPhaseMinified = GameBaseMinified<GamePhase.answerOffer> & {
  /** prompt */
  pr: GameAnswerOfferPhase['prompt'];
};

export type GameAnswerTradePhaseMinified = GameBaseMinified<GamePhase.answerTrade> & {
  /** prompt */
  pr: GameAnswerTradePhase['prompt'];
};

export type GameApplyCardPhaseMinified = GameBaseMinified<GamePhase.applyCard> & {
  /** prompt */
  pr: GameApplyCardPhase['prompt'];
};

export type GameBuyPropertyPhaseMinified = GameBaseMinified<GamePhase.buyProperty> & {
  /** prompt */
  pr: GameBuyPropertyPhase['prompt'];
};

export type GameBuyPropertyLiquidationPhaseMinified =
  GameBaseMinified<GamePhase.buyPropertyLiquidation> & {
    /** pendingPrompt */
    pp: GameBuyPropertyLiquidationPhase['pendingPrompt'];
  };

export type GameCannotPayPhaseMinified = GameBaseMinified<GamePhase.cannotPay> & {
  /** prompt */
  pr: GameCannotPayPhase['prompt'];
};

export type GamePendingPaymentLiquidationPhaseMinified =
  GameBaseMinified<GamePhase.pendingPaymentLiquidation> & {
    /** pendingEvent */
    pe: GamePendingPaymentLiquidationPhase['pendingEvent'];
  };

export type GamePlayerAnimationPhaseMinified = GameBaseMinified<GamePhase.playerAnimation> & {
  /** Not minifying, as it will not be persisted in the event history */
  a: GamePlayerAnimationPhase['animation'];
};

export type GamePlayerWinsPhaseMinified = GameBaseMinified<GamePhase.playerWins> & {
  /** prompt */
  pr: GamePlayerWinsPhase['prompt'];
};

export type GameTradePhaseMinified = GameBaseMinified<GamePhase.trade> & {
  /** other */
  ot: GameTradePhase['other'];
  /** ownSquaresId */
  ows: GameTradePhase['ownSquaresId'];
  /** previousPhase */
  pp: GameTradePhase['previousPhase'];
};

export type GameMinified =
  | GameAnswerOfferPhaseMinified
  | GameAnswerTradePhaseMinified
  | GameApplyCardPhaseMinified
  | GameBuyPropertyPhaseMinified
  | GameBuyPropertyLiquidationPhaseMinified
  | GameCannotPayPhaseMinified
  | GameBaseMinified<GamePhase.diceAnimation>
  | GameBaseMinified<GamePhase.diceInJailAnimation>
  | GameBaseMinified<GamePhase.drawCard>
  | GameBaseMinified<GamePhase.goToJail>
  | GameBaseMinified<GamePhase.jailOptions>
  | GameBaseMinified<GamePhase.outOfJailAnimation>
  | GamePendingPaymentLiquidationPhaseMinified
  | GameBaseMinified<GamePhase.play>
  | GamePlayerAnimationPhaseMinified
  | GamePlayerWinsPhaseMinified
  | GameBaseMinified<GamePhase.rollDice>
  | GameTradePhaseMinified;
