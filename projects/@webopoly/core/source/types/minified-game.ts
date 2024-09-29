import { GamePhase } from '../enums';
import { EventMinified } from './event-minified';
import { Game } from './game';
import { PlayerMinified } from './player-minified';
import { SquareMinified } from './square-minified';

type MinifiedGameBase<TPhase extends GamePhase> = {
  /** centerPot */
  cp: Game<any>['centerPot'];
  /** currentPlayerId */
  ci: Game<any>['currentPlayerId'];
  /** dice */
  d: Game<any>['dice'];
  /** defaultAction */
  da: Game<any>['defaultAction'];
  /** eventHistory */
  eh: EventMinified[];
  /** nextCardIds */
  nci: Game<any>['nextCardIds'];
  /** notifications */
  n: EventMinified[];
  /** phase */
  ph: TPhase;
  /** players */
  pl: PlayerMinified[];
  /** squares */
  sq: SquareMinified[];
};

type MinifiedGamePhaseData<
  TPhase extends GamePhase,
  TPhaseData = any,
> = MinifiedGameBase<TPhase> & {
  /** phaseData */
  pd: TPhaseData;
};

export type MinifiedGame<TPhase extends GamePhase> = TPhase extends GamePhase.answerOffer
  ? MinifiedGamePhaseData<GamePhase.answerOffer, Game<GamePhase.answerOffer>['phaseData']>
  : TPhase extends GamePhase.answerTrade
  ? MinifiedGamePhaseData<GamePhase.answerTrade, Game<GamePhase.answerTrade>['phaseData']>
  : TPhase extends GamePhase.applyCard
  ? MinifiedGamePhaseData<GamePhase.applyCard, Game<GamePhase.applyCard>['phaseData']>
  : TPhase extends GamePhase.avatarAnimation
  ? MinifiedGamePhaseData<GamePhase.avatarAnimation, Game<GamePhase.avatarAnimation>['phaseData']>
  : TPhase extends GamePhase.buyProperty
  ? MinifiedGamePhaseData<GamePhase.buyProperty, Game<GamePhase.buyProperty>['phaseData']>
  : TPhase extends GamePhase.buyingLiquidation
  ? MinifiedGamePhaseData<
      GamePhase.buyingLiquidation,
      Game<GamePhase.buyingLiquidation>['phaseData']
    >
  : TPhase extends GamePhase.cannotPay
  ? MinifiedGamePhaseData<GamePhase.cannotPay, Game<GamePhase.cannotPay>['phaseData']>
  : TPhase extends GamePhase.diceAnimation
  ? MinifiedGameBase<GamePhase.diceAnimation>
  : TPhase extends GamePhase.diceInJailAnimation
  ? MinifiedGameBase<GamePhase.diceInJailAnimation>
  : TPhase extends GamePhase.drawCard
  ? MinifiedGameBase<GamePhase.drawCard>
  : TPhase extends GamePhase.jailNotification
  ? MinifiedGameBase<GamePhase.jailNotification>
  : TPhase extends GamePhase.jailOptions
  ? MinifiedGameBase<GamePhase.jailOptions>
  : TPhase extends GamePhase.outOfJailAnimation
  ? MinifiedGameBase<GamePhase.outOfJailAnimation>
  : TPhase extends GamePhase.paymentLiquidation
  ? MinifiedGamePhaseData<
      GamePhase.paymentLiquidation,
      Game<GamePhase.paymentLiquidation>['phaseData']
    >
  : TPhase extends GamePhase.play
  ? MinifiedGameBase<GamePhase.play>
  : TPhase extends GamePhase.playerWins
  ? MinifiedGamePhaseData<GamePhase.playerWins, Game<GamePhase.playerWins>['phaseData']>
  : TPhase extends GamePhase.rollDice
  ? MinifiedGameBase<GamePhase.rollDice>
  : TPhase extends GamePhase.trade
  ? MinifiedGamePhaseData<GamePhase.trade, Game<GamePhase.trade>['phaseData']>
  : never;
