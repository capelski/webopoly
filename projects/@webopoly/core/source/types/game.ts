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

type GameBase<TPhase extends GamePhase> = {
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

type GamePhaseData<TPhase extends GamePhase, TPhaseData = any> = GameBase<TPhase> & {
  phaseData: TPhaseData;
};

export type GameAnswerOfferPhase = GamePhaseData<
  GamePhase.answerOffer,
  {
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
  }
>;

export type GameAnswerTradePhase = GamePhaseData<
  GamePhase.answerTrade,
  {
    playerId: Player['id'];
    playerPropertiesId: Square['id'][];
    previous: GamePhase.play | GamePhase.rollDice;
    targetPlayerId: Player['id'];
    targetPropertiesId: Square['id'][];
  }
>;

export type GameApplyCardPhase = GamePhaseData<
  GamePhase.applyCard,
  {
    cardId: Card['id'];
  }
>;

export type GameBuyPropertyPhase = GamePhaseData<GamePhase.buyProperty, BuyPropertyData>;

export type GameBuyPropertyLiquidationPhase = GamePhaseData<
  GamePhase.buyPropertyLiquidation,
  BuyPropertyData
>;

export type GameCannotPayPhase = GamePhaseData<GamePhase.cannotPay, PendingEvent>;

export type GameDiceAnimationPhase = GameBase<GamePhase.diceAnimation>;

export type GameDiceInJailAnimationPhase = GameBase<GamePhase.diceInJailAnimation>;

export type GameDrawCardPhase = GameBase<GamePhase.drawCard>;

export type GameGoToJailPhase = GameBase<GamePhase.goToJail>;

export type GameJailOptionsPhase = GameBase<GamePhase.jailOptions>;

export type GameOutOfJailAnimationPhase = GameBase<GamePhase.outOfJailAnimation>;

export type GamePendingPaymentLiquidationPhase = GamePhaseData<
  GamePhase.pendingPaymentLiquidation,
  PendingEvent
>;

export type GamePlayPhase = GameBase<GamePhase.play>;

export type GamePlayerAnimationPhase = GamePhaseData<
  GamePhase.playerAnimation,
  {
    currentSquareId: Square['id'];
    pendingMoves: number;
    playerId: Player['id'];
  }
>;

export type GamePlayerWinsPhase = GamePhaseData<
  GamePhase.playerWins,
  {
    playerId: Player['id'];
  }
>;

export type GameRollDicePhase = GameBase<GamePhase.rollDice>;

export type GameTradePhase = GamePhaseData<
  GamePhase.trade,
  {
    previousPhase: GamePhase.play | GamePhase.rollDice;
    other: { ownerId: Player['id'] | undefined; squaresId: Square['id'][] };
    ownSquaresId: Square['id'][];
  }
>;

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
