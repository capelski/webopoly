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
  /** phaseData */
  pd: GameAnswerOfferPhase['phaseData'];
};

export type GameAnswerTradePhaseMinified = GameBaseMinified<GamePhase.answerTrade> & {
  /** phaseData */
  pd: GameAnswerTradePhase['phaseData'];
};

export type GameApplyCardPhaseMinified = GameBaseMinified<GamePhase.applyCard> & {
  /** phaseData */
  pd: GameApplyCardPhase['phaseData'];
};

export type GameBuyPropertyPhaseMinified = GameBaseMinified<GamePhase.buyProperty> & {
  /** phaseData */
  pd: GameBuyPropertyPhase['phaseData'];
};

export type GameBuyPropertyLiquidationPhaseMinified =
  GameBaseMinified<GamePhase.buyPropertyLiquidation> & {
    /** phaseData */
    pd: GameBuyPropertyLiquidationPhase['phaseData'];
  };

export type GameCannotPayPhaseMinified = GameBaseMinified<GamePhase.cannotPay> & {
  /** phaseData */
  pd: GameCannotPayPhase['phaseData'];
};

export type GamePendingPaymentLiquidationPhaseMinified =
  GameBaseMinified<GamePhase.pendingPaymentLiquidation> & {
    /** phaseData */
    pd: GamePendingPaymentLiquidationPhase['phaseData'];
  };

export type GamePlayerAnimationPhaseMinified = GameBaseMinified<GamePhase.playerAnimation> & {
  /** phaseData */
  pd: GamePlayerAnimationPhase['phaseData'];
};

export type GamePlayerWinsPhaseMinified = GameBaseMinified<GamePhase.playerWins> & {
  /** phaseData */
  pd: GamePlayerWinsPhase['phaseData'];
};

export type GameTradePhaseMinified = GameBaseMinified<GamePhase.trade> & {
  /** phaseData */
  pd: GameTradePhase['phaseData'];
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
