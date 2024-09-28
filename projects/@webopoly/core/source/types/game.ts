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

export type Game<TPhase extends GamePhase> = TPhase extends GamePhase.answerOffer
  ? GamePhaseData<
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
    >
  : TPhase extends GamePhase.answerTrade
  ? GamePhaseData<
      GamePhase.answerTrade,
      {
        playerId: Player['id'];
        playerPropertiesId: Square['id'][];
        previous: GamePhase.play | GamePhase.rollDice;
        targetPlayerId: Player['id'];
        targetPropertiesId: Square['id'][];
      }
    >
  : TPhase extends GamePhase.applyCard
  ? GamePhaseData<
      GamePhase.applyCard,
      {
        cardId: Card['id'];
      }
    >
  : TPhase extends GamePhase.buyProperty
  ? GamePhaseData<GamePhase.buyProperty, BuyPropertyData>
  : TPhase extends GamePhase.buyingLiquidation
  ? GamePhaseData<GamePhase.buyingLiquidation, BuyPropertyData>
  : TPhase extends GamePhase.cannotPay
  ? GamePhaseData<GamePhase.cannotPay, PendingEvent>
  : TPhase extends GamePhase.diceAnimation
  ? GameBase<GamePhase.diceAnimation>
  : TPhase extends GamePhase.diceInJailAnimation
  ? GameBase<GamePhase.diceInJailAnimation>
  : TPhase extends GamePhase.drawCard
  ? GameBase<GamePhase.drawCard>
  : TPhase extends GamePhase.goToJail
  ? GameBase<GamePhase.goToJail>
  : TPhase extends GamePhase.jailOptions
  ? GameBase<GamePhase.jailOptions>
  : TPhase extends GamePhase.outOfJailAnimation
  ? GameBase<GamePhase.outOfJailAnimation>
  : TPhase extends GamePhase.paymentLiquidation
  ? GamePhaseData<GamePhase.paymentLiquidation, PendingEvent>
  : TPhase extends GamePhase.play
  ? GameBase<GamePhase.play>
  : TPhase extends GamePhase.playerAnimation
  ? GamePhaseData<
      GamePhase.playerAnimation,
      {
        currentSquareId: Square['id'];
        pendingMoves: number;
        playerId: Player['id'];
      }
    >
  : TPhase extends GamePhase.playerWins
  ? GamePhaseData<
      GamePhase.playerWins,
      {
        playerId: Player['id'];
      }
    >
  : TPhase extends GamePhase.rollDice
  ? GameBase<GamePhase.rollDice>
  : TPhase extends GamePhase.trade
  ? GamePhaseData<
      GamePhase.trade,
      {
        previousPhase: GamePhase.play | GamePhase.rollDice;
        other: { ownerId: Player['id'] | undefined; squaresId: Square['id'][] };
        ownSquaresId: Square['id'][];
      }
    >
  : never;
