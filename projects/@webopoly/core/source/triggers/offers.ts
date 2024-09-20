import { longActionInterval } from '../constants';
import { AnswerType, EventType, GamePhase, GameUpdateType, OfferType } from '../enums';
import { getCurrentPlayer } from '../logic';
import {
  Game_AnswerOffer,
  Game_BuyingLiquidation,
  Game_PaymentLiquidation,
  Game_Play,
  Game_RollDice,
  Player,
  PropertySquare,
} from '../types';

type SellOfferInputPhases =
  | Game_BuyingLiquidation
  | Game_PaymentLiquidation
  | Game_Play
  | Game_RollDice;

export const triggerAcceptOffer = (game: Game_AnswerOffer): SellOfferInputPhases => {
  const { buyerId, sellerId } =
    game.phaseData.offerType === OfferType.sell
      ? { buyerId: game.phaseData.targetPlayerId, sellerId: game.phaseData.playerId }
      : { buyerId: game.phaseData.playerId, sellerId: game.phaseData.targetPlayerId };

  return {
    ...game,
    ...game.phaseData.previous,
    defaultAction: {
      playerId: game.phaseData.playerId,
      update:
        game.phaseData.previous.phase === GamePhase.play
          ? { type: GameUpdateType.endTurn }
          : game.phaseData.previous.phase === GamePhase.rollDice
          ? { type: GameUpdateType.rollDice }
          : { type: GameUpdateType.resume },
      interval:
        game.phaseData.previous.phase === GamePhase.buyingLiquidation ||
        game.phaseData.previous.phase === GamePhase.paymentLiquidation
          ? longActionInterval * 1000
          : undefined,
    },
    notifications: [
      ...game.notifications,
      {
        amount: game.phaseData.amount,
        answer: AnswerType.accept,
        offerType: game.phaseData.offerType,
        playerId: game.phaseData.targetPlayerId,
        propertyId: game.phaseData.propertyId,
        targetPlayerId: game.phaseData.playerId,
        type: EventType.answerOffer,
      },
    ],
    players: game.players.map((p) => {
      return p.id === buyerId
        ? {
            ...p,
            properties: p.properties.concat(game.phaseData.propertyId),
            money: p.money - game.phaseData.amount,
          }
        : p.id === sellerId
        ? {
            ...p,
            properties: p.properties.filter((pId) => pId !== game.phaseData.propertyId),
            money: p.money + game.phaseData.amount,
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === game.phaseData.propertyId ? { ...s, ownerId: buyerId } : s;
    }),
  };
};

export const triggerBuyingOffer = (
  game: Game_Play | Game_RollDice,
  property: PropertySquare,
  amount: number,
): Game_AnswerOffer => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    defaultAction: {
      playerId: property.ownerId!,
      update: { type: GameUpdateType.declineOffer },
    },
    phase: GamePhase.answerOffer,
    phaseData: {
      amount,
      offerType: OfferType.buy,
      playerId: currentPlayer.id,
      previous: { phase: game.phase },
      propertyId: property.id,
      targetPlayerId: property.ownerId!,
    },
  };
};

export const triggerDeclineOffer = (game: Game_AnswerOffer): SellOfferInputPhases => {
  return {
    ...game,
    ...game.phaseData.previous,
    defaultAction: {
      playerId: game.phaseData.playerId,
      update:
        game.phaseData.previous.phase === GamePhase.play
          ? { type: GameUpdateType.endTurn }
          : game.phaseData.previous.phase === GamePhase.rollDice
          ? { type: GameUpdateType.rollDice }
          : { type: GameUpdateType.resume },
      interval:
        game.phaseData.previous.phase === GamePhase.buyingLiquidation ||
        game.phaseData.previous.phase === GamePhase.paymentLiquidation
          ? longActionInterval * 1000
          : undefined,
    },
    notifications: [
      ...game.notifications,
      {
        amount: game.phaseData.amount,
        answer: AnswerType.decline,
        offerType: game.phaseData.offerType,
        playerId: game.phaseData.targetPlayerId,
        propertyId: game.phaseData.propertyId,
        targetPlayerId: game.phaseData.playerId,
        type: EventType.answerOffer,
      },
    ],
  };
};

export const triggerSellingOffer = (
  game: SellOfferInputPhases,
  property: PropertySquare,
  amount: number,
  targetPlayerId: Player['id'],
): Game_AnswerOffer => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    defaultAction: {
      playerId: targetPlayerId,
      update: { type: GameUpdateType.declineOffer },
    },
    phase: GamePhase.answerOffer,
    phaseData: {
      amount,
      offerType: OfferType.sell,
      playerId: currentPlayer.id,
      previous:
        game.phase === GamePhase.buyingLiquidation
          ? { phase: game.phase, phaseData: game.phaseData }
          : game.phase === GamePhase.paymentLiquidation
          ? { phase: game.phase, phaseData: game.phaseData }
          : { phase: game.phase },
      propertyId: property.id,
      targetPlayerId,
    },
  };
};
