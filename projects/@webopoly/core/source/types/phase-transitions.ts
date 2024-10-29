import { GamePhase } from '../enums';
import { Game } from './game';
import { Player } from './player';
import { PropertySquare } from './square';

type TransitionData = (...parameters: Array<any>) => GamePhase;

export type BaseTransitionsMap = {
  [TIn in GamePhase]?: {
    [key: string]: TransitionData;
  };
};

export type Enforcer<T extends BaseTransitionsMap> = T;

export type TransitionsMap = Enforcer<{
  [GamePhase.answerOffer]: {};
  [GamePhase.answerTrade_play]: {
    answerTrade: () => GamePhase.play;
  };
  [GamePhase.answerTrade_rollDice]: {
    answerTrade: () => GamePhase.rollDice;
  };
  [GamePhase.applyCard]: {};
  [GamePhase.avatarAnimation]: {};
  [GamePhase.buyProperty]: {
    playerBuys: (propertySquare: PropertySquare, buyerId: Player['id']) => GamePhase.play;
    playerDeclines: () => GamePhase.play | GamePhase.buyProperty;
  };
  [GamePhase.buyingLiquidation]: {};
  [GamePhase.cannotPay]: {};
  [GamePhase.diceAnimation]: {};
  [GamePhase.diceInJailAnimation]: {};
  [GamePhase.drawCard]: {
    drawCard: () => GamePhase.applyCard;
  };
  [GamePhase.jailNotification]: {};
  [GamePhase.jailOptions]: {
    useJailCard: () => GamePhase.rollDice;
  };
  [GamePhase.outOfJailAnimation]: {};
  [GamePhase.paymentLiquidation]: {};
  [GamePhase.play]: {
    enterTrading: () => GamePhase.trade_play;
  };
  [GamePhase.playerWins]: {};
  [GamePhase.rollDice]: {
    enterTrading: () => GamePhase.trade_rollDice;
  };
  [GamePhase.trade_play]: {
    exitTrading: () => GamePhase.play;
    sendTradingOffer: () => GamePhase.answerTrade_play;
    toggleTradingSelection: (square: PropertySquare) => GamePhase.trade_play;
  };
  [GamePhase.trade_rollDice]: {
    exitTrading: () => GamePhase.rollDice;
    sendTradingOffer: () => GamePhase.answerTrade_rollDice;
    toggleTradingSelection: (square: PropertySquare) => GamePhase.trade_rollDice;
  };
}>;

export type GameInPhase<TPhase extends GamePhase> = Game<any> & { phase: TPhase };

export type Transition<
  TIn extends keyof TransitionsMap & GamePhase,
  TName extends keyof TransitionsMap[TIn] & string,
> = TransitionsMap[TIn][TName] extends TransitionData
  ? (
      game: GameInPhase<TIn>,
      ...args: Parameters<TransitionsMap[TIn][TName]>
    ) => GameInPhase<ReturnType<TransitionsMap[TIn][TName]>>
  : never;
