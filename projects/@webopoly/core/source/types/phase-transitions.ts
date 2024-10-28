import { GamePhase } from '../enums';
import { Game } from './game';
import { PropertySquare } from './square';

export type GameInPhase<TPhase extends GamePhase> = Game<any> & { phase: TPhase };

export type BaseTransitionsMap = {
  [TIn in GamePhase]: {
    [TOut in GamePhase]?: Array<any>;
  };
};

export type Enforcer<T extends BaseTransitionsMap> = T;

export type TransitionsMap = Enforcer<{
  [GamePhase.answerOffer]: {};
  [GamePhase.answerTrade_play]: {
    [GamePhase.play]: undefined; // Target player accepts or declines trade
  };
  [GamePhase.answerTrade_rollDice]: {
    [GamePhase.rollDice]: undefined; // Target player accepts or declines trade
  };
  [GamePhase.applyCard]: {};
  [GamePhase.avatarAnimation]: {};
  [GamePhase.buyProperty]: {};
  [GamePhase.buyingLiquidation]: {};
  [GamePhase.cannotPay]: {};
  [GamePhase.diceAnimation]: {};
  [GamePhase.diceInJailAnimation]: {};
  [GamePhase.drawCard]: {};
  [GamePhase.jailNotification]: {};
  [GamePhase.jailOptions]: {};
  [GamePhase.outOfJailAnimation]: {};
  [GamePhase.paymentLiquidation]: {};
  [GamePhase.play]: {
    [GamePhase.trade_play]: undefined; // Player enters trading selection mode
  };
  [GamePhase.playerWins]: {};
  [GamePhase.rollDice]: {
    [GamePhase.trade_rollDice]: undefined; // Player enters trading selection mode
  };
  [GamePhase.trade_play]: {
    [GamePhase.answerTrade_play]: undefined; // Player sends a trading offer
    [GamePhase.play]: undefined; // Player exits trading selection mode
    [GamePhase.trade_play]: [square: PropertySquare]; // Player changes the current trade selection
  };
  [GamePhase.trade_rollDice]: {
    [GamePhase.answerTrade_rollDice]: undefined; // Player sends a trading offer
    [GamePhase.rollDice]: undefined; // Player exits trading selection mode
    [GamePhase.trade_rollDice]: [square: PropertySquare]; // Player changes the current trade selection
  };
}>;

export type Transition<
  TIn extends keyof TransitionsMap & GamePhase,
  TOut extends keyof TransitionsMap[TIn] & GamePhase,
> = TransitionsMap[TIn][TOut] extends Array<any>
  ? (game: GameInPhase<TIn>, ...args: TransitionsMap[TIn][TOut]) => GameInPhase<TOut>
  : (game: GameInPhase<TIn>) => GameInPhase<TOut>;
