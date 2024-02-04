import { AnswerType, EventType, GamePhase, OfferType, PromptType } from '../enums';
import { getCurrentPlayer } from '../logic';
import { GameNonPromptPhase, GamePromptPhase, Id, PropertySquare } from '../types';

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
  game: GameNonPromptPhase,
  property: PropertySquare,
  amount: number,
): GameNonPromptPhase | GamePromptPhase<PromptType.answerOffer> => {
  const currentPlayer = getCurrentPlayer(game);
  if (currentPlayer.money < amount || property.ownerId === undefined) {
    return game;
  }

  return {
    ...game,
    phase: GamePhase.prompt,
    prompt: {
      amount,
      offerType: OfferType.buy,
      playerId: currentPlayer.id,
      previous:
        game.phase === GamePhase.cannotPay
          ? { pendingEvent: game.pendingEvent, phase: game.phase }
          : { phase: game.phase },
      propertyId: property.id,
      targetPlayerId: property.ownerId,
      type: PromptType.answerOffer,
    },
  };
};

export const triggerDeclineOffer = (
  game: GamePromptPhase<PromptType.answerOffer>,
): GameNonPromptPhase => {
  return {
    ...game,
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
  game: GameNonPromptPhase,
  property: PropertySquare,
  amount: number,
  targetPlayerId: Id,
): GamePromptPhase<PromptType.answerOffer> => {
  return {
    ...game,
    phase: GamePhase.prompt,
    prompt: {
      amount,
      offerType: OfferType.sell,
      playerId: game.currentPlayerId,
      previous:
        game.phase === GamePhase.cannotPay
          ? { pendingEvent: game.pendingEvent, phase: game.phase }
          : { phase: game.phase },
      propertyId: property.id,
      targetPlayerId,
      type: PromptType.answerOffer,
    },
  };
};
