import { GamePhase } from '../enums';
import { EventMinified } from './event-minified';
import {
  Game,
  Game_AnswerOffer,
  Game_AnswerTrade,
  Game_ApplyCard,
  Game_BuyProperty,
  Game_BuyingLiquidation,
  Game_CannotPay,
  Game_PaymentLiquidation,
  Game_PlayerAnimation,
  Game_PlayerWins,
  Game_Trade,
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

type MinifiedGame_AnswerOffer = MinifiedGameBase<GamePhase.answerOffer> & {
  /** phaseData */
  pd: Game_AnswerOffer['phaseData'];
};

type MinifiedGame_AnswerTrade = MinifiedGameBase<GamePhase.answerTrade> & {
  /** phaseData */
  pd: Game_AnswerTrade['phaseData'];
};

type MinifiedGame_ApplyCard = MinifiedGameBase<GamePhase.applyCard> & {
  /** phaseData */
  pd: Game_ApplyCard['phaseData'];
};

type MinifiedGame_BuyProperty = MinifiedGameBase<GamePhase.buyProperty> & {
  /** phaseData */
  pd: Game_BuyProperty['phaseData'];
};

type MinifiedGame_BuyingLiquidation = MinifiedGameBase<GamePhase.buyingLiquidation> & {
  /** phaseData */
  pd: Game_BuyingLiquidation['phaseData'];
};

type MinifiedGame_CannotPay = MinifiedGameBase<GamePhase.cannotPay> & {
  /** phaseData */
  pd: Game_CannotPay['phaseData'];
};

type MinifiedGame_PaymentLiquidation = MinifiedGameBase<GamePhase.paymentLiquidation> & {
  /** phaseData */
  pd: Game_PaymentLiquidation['phaseData'];
};

type MinifiedGame_PlayerAnimation = MinifiedGameBase<GamePhase.playerAnimation> & {
  /** phaseData */
  pd: Game_PlayerAnimation['phaseData'];
};

type MinifiedGame_PlayerWins = MinifiedGameBase<GamePhase.playerWins> & {
  /** phaseData */
  pd: Game_PlayerWins['phaseData'];
};

type MinifiedGame_Trade = MinifiedGameBase<GamePhase.trade> & {
  /** phaseData */
  pd: Game_Trade['phaseData'];
};

export type MinifiedGame =
  | MinifiedGame_AnswerOffer
  | MinifiedGame_AnswerTrade
  | MinifiedGame_ApplyCard
  | MinifiedGame_BuyProperty
  | MinifiedGame_BuyingLiquidation
  | MinifiedGame_CannotPay
  | MinifiedGameBase<GamePhase.diceAnimation>
  | MinifiedGameBase<GamePhase.diceInJailAnimation>
  | MinifiedGameBase<GamePhase.drawCard>
  | MinifiedGameBase<GamePhase.goToJail>
  | MinifiedGameBase<GamePhase.jailOptions>
  | MinifiedGameBase<GamePhase.outOfJailAnimation>
  | MinifiedGame_PaymentLiquidation
  | MinifiedGameBase<GamePhase.play>
  | MinifiedGame_PlayerAnimation
  | MinifiedGame_PlayerWins
  | MinifiedGameBase<GamePhase.rollDice>
  | MinifiedGame_Trade;
