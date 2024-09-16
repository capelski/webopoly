import { longActionInterval } from '../constants';
import { AnswerType, EventType, GamePhase, GameUpdateType, OfferType, PromptType } from '../enums';
import { getCurrentPlayer } from '../logic';
import {
  GameBuyPropertyLiquidationPhase,
  GamePendingPaymentLiquidationPhase,
  GamePlayPhase,
  GamePromptPhase,
  GameRollDicePhase,
  Player,
  PropertySquare,
} from '../types';

type SellOfferInputPhases =
  | GameBuyPropertyLiquidationPhase
  | GamePendingPaymentLiquidationPhase
  | GamePlayPhase
  | GameRollDicePhase;

const savePhaseData = (game: SellOfferInputPhases) =>
  game.phase === GamePhase.buyPropertyLiquidation
    ? { previousPhase: game.phase, pendingPrompt: game.pendingPrompt }
    : game.phase === GamePhase.pendingPaymentLiquidation
    ? { previousPhase: game.phase, pendingEvent: game.pendingEvent }
    : { previousPhase: game.phase };

const restorePhaseData = (game: GamePromptPhase<PromptType.answerOffer>) =>
  game.prompt.previousPhase === GamePhase.buyPropertyLiquidation
    ? { phase: game.prompt.previousPhase, pendingPrompt: game.prompt.pendingPrompt }
    : game.prompt.previousPhase === GamePhase.pendingPaymentLiquidation
    ? { phase: game.prompt.previousPhase, pendingEvent: game.prompt.pendingEvent }
    : { phase: game.prompt.previousPhase };

export const triggerAcceptOffer = (
  game: GamePromptPhase<PromptType.answerOffer>,
): SellOfferInputPhases => {
  const { buyerId, sellerId } =
    game.prompt.offerType === OfferType.sell
      ? { buyerId: game.prompt.targetPlayerId, sellerId: game.prompt.playerId }
      : { buyerId: game.prompt.playerId, sellerId: game.prompt.targetPlayerId };

  return {
    ...game,
    defaultAction: {
      playerId: game.prompt.playerId,
      update:
        game.prompt.previousPhase === GamePhase.play
          ? { type: GameUpdateType.endTurn }
          : game.prompt.previousPhase === GamePhase.rollDice
          ? { type: GameUpdateType.rollDice }
          : { type: GameUpdateType.resume },
      interval:
        game.prompt.previousPhase === GamePhase.buyPropertyLiquidation ||
        game.prompt.previousPhase === GamePhase.pendingPaymentLiquidation
          ? longActionInterval * 1000
          : undefined,
    },
    notifications: [
      ...game.notifications,
      {
        amount: game.prompt.amount,
        answer: AnswerType.accept,
        offerType: game.prompt.offerType,
        playerId: game.prompt.targetPlayerId,
        propertyId: game.prompt.propertyId,
        targetPlayerId: game.prompt.playerId,
        type: EventType.answerOffer,
      },
    ],
    players: game.players.map((p) => {
      return p.id === buyerId
        ? {
            ...p,
            properties: p.properties.concat(game.prompt.propertyId),
            money: p.money - game.prompt.amount,
          }
        : p.id === sellerId
        ? {
            ...p,
            properties: p.properties.filter((pId) => pId !== game.prompt.propertyId),
            money: p.money + game.prompt.amount,
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === game.prompt.propertyId ? { ...s, ownerId: buyerId } : s;
    }),
    ...restorePhaseData(game),
  };
};

export const triggerBuyingOffer = (
  game: GamePlayPhase | GameRollDicePhase,
  property: PropertySquare,
  amount: number,
): GamePromptPhase<PromptType.answerOffer> => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    defaultAction: {
      playerId: property.ownerId!,
      update: { type: GameUpdateType.declineOffer },
    },
    phase: GamePhase.prompt,
    prompt: {
      amount,
      offerType: OfferType.buy,
      playerId: currentPlayer.id,
      propertyId: property.id,
      targetPlayerId: property.ownerId!,
      type: PromptType.answerOffer,
      ...savePhaseData(game),
    },
  };
};

export const triggerDeclineOffer = (
  game: GamePromptPhase<PromptType.answerOffer>,
): SellOfferInputPhases => {
  return {
    ...game,
    defaultAction: {
      playerId: game.prompt.playerId,
      update:
        game.prompt.previousPhase === GamePhase.play
          ? { type: GameUpdateType.endTurn }
          : game.prompt.previousPhase === GamePhase.rollDice
          ? { type: GameUpdateType.rollDice }
          : { type: GameUpdateType.resume },
      interval:
        game.prompt.previousPhase === GamePhase.buyPropertyLiquidation ||
        game.prompt.previousPhase === GamePhase.pendingPaymentLiquidation
          ? longActionInterval * 1000
          : undefined,
    },
    notifications: [
      ...game.notifications,
      {
        amount: game.prompt.amount,
        answer: AnswerType.decline,
        offerType: game.prompt.offerType,
        playerId: game.prompt.targetPlayerId,
        propertyId: game.prompt.propertyId,
        targetPlayerId: game.prompt.playerId,
        type: EventType.answerOffer,
      },
    ],
    ...restorePhaseData(game),
  };
};

export const triggerSellingOffer = (
  game: SellOfferInputPhases,
  property: PropertySquare,
  amount: number,
  targetPlayerId: Player['id'],
): GamePromptPhase<PromptType.answerOffer> => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    defaultAction: {
      playerId: targetPlayerId,
      update: { type: GameUpdateType.declineOffer },
    },
    phase: GamePhase.prompt,
    prompt: {
      amount,
      offerType: OfferType.sell,
      playerId: currentPlayer.id,
      propertyId: property.id,
      targetPlayerId,
      type: PromptType.answerOffer,
      ...savePhaseData(game),
    },
  };
};
