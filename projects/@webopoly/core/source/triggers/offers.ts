import { longActionInterval } from '../constants';
import {
  AnswerType,
  EventType,
  GamePhase,
  GameUpdateType,
  LiquidationReason,
  OfferType,
  PromptType,
} from '../enums';
import { getCurrentPlayer } from '../logic';
import {
  GameLiquidationPhase,
  GameNonPromptPhase,
  GamePlayPhase,
  GamePromptPhase,
  GameRollDicePhase,
  NonPromptPhasePayload,
  Player,
  PropertySquare,
} from '../types';

const getPreviousPayload = (
  game: GameLiquidationPhase<LiquidationReason> | GamePlayPhase | GameRollDicePhase,
): NonPromptPhasePayload => {
  return game.phase === GamePhase.liquidation
    ? game.reason === LiquidationReason.buyProperty
      ? { phase: game.phase, reason: game.reason, pendingPrompt: game.pendingPrompt }
      : { phase: game.phase, reason: game.reason, pendingEvent: game.pendingEvent }
    : { phase: game.phase };
};

export const triggerAcceptOffer = (
  game: GamePromptPhase<PromptType.answerOffer>,
): GameNonPromptPhase => {
  const { buyerId, sellerId } =
    game.prompt.offerType === OfferType.sell
      ? { buyerId: game.prompt.targetPlayerId, sellerId: game.prompt.playerId }
      : { buyerId: game.prompt.playerId, sellerId: game.prompt.targetPlayerId };

  return {
    ...game,
    ...game.prompt.previous,
    defaultAction: {
      playerId: game.prompt.playerId,
      update:
        game.prompt.previous.phase === GamePhase.play
          ? { type: GameUpdateType.endTurn }
          : game.prompt.previous.phase === GamePhase.rollDice
          ? { type: GameUpdateType.rollDice }
          : { type: GameUpdateType.resume },
      interval:
        game.prompt.previous.phase === GamePhase.liquidation
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
      previous: getPreviousPayload(game),
      propertyId: property.id,
      targetPlayerId: property.ownerId!,
      type: PromptType.answerOffer,
    },
  };
};

export const triggerDeclineOffer = (
  game: GamePromptPhase<PromptType.answerOffer>,
): GameNonPromptPhase => {
  return {
    ...game,
    defaultAction: {
      playerId: game.prompt.playerId,
      update:
        game.prompt.previous.phase === GamePhase.play
          ? { type: GameUpdateType.endTurn }
          : game.prompt.previous.phase === GamePhase.rollDice
          ? { type: GameUpdateType.rollDice }
          : { type: GameUpdateType.resume },
      interval:
        game.prompt.previous.phase === GamePhase.liquidation
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
    ...game.prompt.previous,
  };
};

export const triggerSellingOffer = (
  game: GameLiquidationPhase<LiquidationReason> | GamePlayPhase | GameRollDicePhase,
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
      previous: getPreviousPayload(game),
      propertyId: property.id,
      targetPlayerId,
      type: PromptType.answerOffer,
    },
  };
};
