import { GamePhase, OfferType } from '../enums';
import { Card } from './card';
import { DefaultAction } from './default-action';
import { Dice } from './dice';
import { GEvent, PendingEvent } from './event';
import { Player } from './player';
import { Square } from './square';

type BuyPropertyData = {
  currentBuyerId: Player['id'];
  potentialBuyersId: Player['id'][];
};

export type GameBase<TPhase extends GamePhase> = {
  centerPot: number;
  currentPlayerId: Player['id'];
  defaultAction: DefaultAction | undefined;
  dice: Dice;
  eventHistory: GEvent[];
  nextCardIds: Card['id'][];
  notifications: GEvent[];
  phase: TPhase;
  players: Player[];
  squares: Square[];
};

export type GameAnswerOfferPhase = GameBase<GamePhase.answerOffer> & {
  phaseData: {
    amount: number;
    offerType: OfferType;
    playerId: Player['id'];
    previous:
      | {
          phase: GamePhase.play | GamePhase.rollDice;
        }
      | {
          phase: GamePhase.buyPropertyLiquidation;
          phaseData: BuyPropertyData;
        }
      | {
          phase: GamePhase.pendingPaymentLiquidation;
          phaseData: PendingEvent;
        };
    propertyId: Square['id'];
    targetPlayerId: Player['id'];
  };
};

export type GameAnswerTradePhase = GameBase<GamePhase.answerTrade> & {
  phaseData: {
    playerId: Player['id'];
    playerPropertiesId: Square['id'][];
    previous: GamePhase.play | GamePhase.rollDice;
    targetPlayerId: Player['id'];
    targetPropertiesId: Square['id'][];
  };
};

export type GameApplyCardPhase = GameBase<GamePhase.applyCard> & {
  phaseData: {
    cardId: Card['id'];
  };
};

export type GameBuyPropertyPhase = GameBase<GamePhase.buyProperty> & {
  phaseData: BuyPropertyData;
};

export type GameBuyPropertyLiquidationPhase = GameBase<GamePhase.buyPropertyLiquidation> & {
  phaseData: BuyPropertyData;
};

export type GameCannotPayPhase = GameBase<GamePhase.cannotPay> & {
  phaseData: PendingEvent;
};

export type GameDiceAnimationPhase = GameBase<GamePhase.diceAnimation>;

export type GameDiceInJailAnimationPhase = GameBase<GamePhase.diceInJailAnimation>;

export type GameDrawCardPhase = GameBase<GamePhase.drawCard>;

export type GameGoToJailPhase = GameBase<GamePhase.goToJail>;

export type GameJailOptionsPhase = GameBase<GamePhase.jailOptions>;

export type GameOutOfJailAnimationPhase = GameBase<GamePhase.outOfJailAnimation>;

export type GamePendingPaymentLiquidationPhase = GameBase<GamePhase.pendingPaymentLiquidation> & {
  phaseData: PendingEvent;
};

export type GamePlayPhase = GameBase<GamePhase.play>;

export type GamePlayerAnimationPhase = GameBase<GamePhase.playerAnimation> & {
  phaseData: {
    currentSquareId: Square['id'];
    pendingMoves: number;
    playerId: Player['id'];
  };
};

export type GamePlayerWinsPhase = GameBase<GamePhase.playerWins> & {
  phaseData: {
    playerId: Player['id'];
  };
};

export type GameRollDicePhase = GameBase<GamePhase.rollDice>;

export type GameTradePhase = GameBase<GamePhase.trade> & {
  phaseData: {
    previousPhase: GamePhase.play | GamePhase.rollDice;
    other: { ownerId: Player['id'] | undefined; squaresId: Square['id'][] };
    ownSquaresId: Square['id'][];
  };
};

export type Game =
  | GameAnswerOfferPhase
  | GameAnswerTradePhase
  | GameApplyCardPhase
  | GameBuyPropertyPhase
  | GameBuyPropertyLiquidationPhase
  | GameCannotPayPhase
  | GameDiceAnimationPhase
  | GameDiceInJailAnimationPhase
  | GameDrawCardPhase
  | GameGoToJailPhase
  | GameJailOptionsPhase
  | GameOutOfJailAnimationPhase
  | GamePendingPaymentLiquidationPhase
  | GamePlayPhase
  | GamePlayerAnimationPhase
  | GamePlayerWinsPhase
  | GameRollDicePhase
  | GameTradePhase;
