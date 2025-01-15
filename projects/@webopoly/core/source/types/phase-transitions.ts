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
  [GamePhase.answerTrade]: {
    answerTrade: () => GamePhase.play | GamePhase.rollDice;
  };
  [GamePhase.applyCard]: {
    applyCard: () => GamePhase.play;
    landsInSurpriseSquareFromCard: () => GamePhase.drawCard; // E.g. Go back three spaces + fall into surprise
  };
  [GamePhase.avatarAnimation]: {
    landsInSurpriseSquare: () => GamePhase.drawCard;
  };
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
    enterTrading: () => GamePhase.trade;
  };
  [GamePhase.playerWins]: {};
  [GamePhase.rollDice]: {
    enterTrading: () => GamePhase.trade;
  };
  [GamePhase.trade]: {
    exitTrading: () => GamePhase.play | GamePhase.rollDice;
    sendTradingOffer: () => GamePhase.answerTrade;
    toggleTradingSelection: (square: PropertySquare) => GamePhase.trade;
  };
}>;

export type Transition<
  TIn extends keyof TransitionsMap & GamePhase,
  TName extends keyof TransitionsMap[TIn] & string,
> = TransitionsMap[TIn][TName] extends TransitionData
  ? (
      game: Game<TIn>,
      ...args: Parameters<TransitionsMap[TIn][TName]>
    ) => Game<ReturnType<TransitionsMap[TIn][TName]>>
  : never;
