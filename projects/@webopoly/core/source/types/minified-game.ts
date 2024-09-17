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

type MinifiedGameBase<TPhase extends GamePhase> = {
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

export type MinifiedGameAnswerOfferPhase = MinifiedGameBase<GamePhase.answerOffer> & {
  /** phaseData */
  pd: GameAnswerOfferPhase['phaseData'];
};

export type MinifiedGameAnswerTradePhase = MinifiedGameBase<GamePhase.answerTrade> & {
  /** phaseData */
  pd: GameAnswerTradePhase['phaseData'];
};

export type MinifiedGameApplyCardPhase = MinifiedGameBase<GamePhase.applyCard> & {
  /** phaseData */
  pd: GameApplyCardPhase['phaseData'];
};

export type MinifiedGameBuyPropertyPhase = MinifiedGameBase<GamePhase.buyProperty> & {
  /** phaseData */
  pd: GameBuyPropertyPhase['phaseData'];
};

export type MinifiedGameBuyPropertyLiquidationPhase =
  MinifiedGameBase<GamePhase.buyingLiquidation> & {
    /** phaseData */
    pd: GameBuyPropertyLiquidationPhase['phaseData'];
  };

export type MinifiedGameCannotPayPhase = MinifiedGameBase<GamePhase.cannotPay> & {
  /** phaseData */
  pd: GameCannotPayPhase['phaseData'];
};

export type MinifiedGamePendingPaymentLiquidationPhase =
  MinifiedGameBase<GamePhase.paymentLiquidation> & {
    /** phaseData */
    pd: GamePendingPaymentLiquidationPhase['phaseData'];
  };

export type MinifiedGamePlayerAnimationPhase = MinifiedGameBase<GamePhase.playerAnimation> & {
  /** phaseData */
  pd: GamePlayerAnimationPhase['phaseData'];
};

export type MinifiedGamePlayerWinsPhase = MinifiedGameBase<GamePhase.playerWins> & {
  /** phaseData */
  pd: GamePlayerWinsPhase['phaseData'];
};

export type MinifiedGameTradePhase = MinifiedGameBase<GamePhase.trade> & {
  /** phaseData */
  pd: GameTradePhase['phaseData'];
};

export type MinifiedGame =
  | MinifiedGameAnswerOfferPhase
  | MinifiedGameAnswerTradePhase
  | MinifiedGameApplyCardPhase
  | MinifiedGameBuyPropertyPhase
  | MinifiedGameBuyPropertyLiquidationPhase
  | MinifiedGameCannotPayPhase
  | MinifiedGameBase<GamePhase.diceAnimation>
  | MinifiedGameBase<GamePhase.diceInJailAnimation>
  | MinifiedGameBase<GamePhase.drawCard>
  | MinifiedGameBase<GamePhase.goToJail>
  | MinifiedGameBase<GamePhase.jailOptions>
  | MinifiedGameBase<GamePhase.outOfJailAnimation>
  | MinifiedGamePendingPaymentLiquidationPhase
  | MinifiedGameBase<GamePhase.play>
  | MinifiedGamePlayerAnimationPhase
  | MinifiedGamePlayerWinsPhase
  | MinifiedGameBase<GamePhase.rollDice>
  | MinifiedGameTradePhase;
