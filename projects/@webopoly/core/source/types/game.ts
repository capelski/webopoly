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

export type Game_AnswerOffer = GamePhaseData<
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
          phase: GamePhase.buyingLiquidation;
          phaseData: BuyPropertyData;
        }
      | {
          phase: GamePhase.paymentLiquidation;
          phaseData: PendingEvent;
        };
    propertyId: Square['id'];
    targetPlayerId: Player['id'];
  }
>;

export type Game_AnswerTrade = GamePhaseData<
  GamePhase.answerTrade,
  {
    playerId: Player['id'];
    playerPropertiesId: Square['id'][];
    previous: GamePhase.play | GamePhase.rollDice;
    targetPlayerId: Player['id'];
    targetPropertiesId: Square['id'][];
  }
>;

export type Game_ApplyCard = GamePhaseData<
  GamePhase.applyCard,
  {
    cardId: Card['id'];
  }
>;

export type Game_BuyProperty = GamePhaseData<GamePhase.buyProperty, BuyPropertyData>;

export type Game_BuyingLiquidation = GamePhaseData<GamePhase.buyingLiquidation, BuyPropertyData>;

export type Game_CannotPay = GamePhaseData<GamePhase.cannotPay, PendingEvent>;

export type Game_DiceAnimation = GameBase<GamePhase.diceAnimation>;

export type Game_DiceInJailAnimation = GameBase<GamePhase.diceInJailAnimation>;

export type Game_DrawCard = GameBase<GamePhase.drawCard>;

export type Game_GoToJail = GameBase<GamePhase.goToJail>;

export type Game_JailOptions = GameBase<GamePhase.jailOptions>;

export type Game_OutOfJailAnimation = GameBase<GamePhase.outOfJailAnimation>;

export type Game_PaymentLiquidation = GamePhaseData<GamePhase.paymentLiquidation, PendingEvent>;

export type Game_Play = GameBase<GamePhase.play>;

export type Game_PlayerAnimation = GamePhaseData<
  GamePhase.playerAnimation,
  {
    currentSquareId: Square['id'];
    pendingMoves: number;
    playerId: Player['id'];
  }
>;

export type Game_PlayerWins = GamePhaseData<
  GamePhase.playerWins,
  {
    playerId: Player['id'];
  }
>;

export type Game_RollDice = GameBase<GamePhase.rollDice>;

export type Game_Trade = GamePhaseData<
  GamePhase.trade,
  {
    previousPhase: GamePhase.play | GamePhase.rollDice;
    other: { ownerId: Player['id'] | undefined; squaresId: Square['id'][] };
    ownSquaresId: Square['id'][];
  }
>;

export type Game =
  | Game_AnswerOffer
  | Game_AnswerTrade
  | Game_ApplyCard
  | Game_BuyProperty
  | Game_BuyingLiquidation
  | Game_CannotPay
  | Game_DiceAnimation
  | Game_DiceInJailAnimation
  | Game_DrawCard
  | Game_GoToJail
  | Game_JailOptions
  | Game_OutOfJailAnimation
  | Game_PaymentLiquidation
  | Game_Play
  | Game_PlayerAnimation
  | Game_PlayerWins
  | Game_RollDice
  | Game_Trade;
