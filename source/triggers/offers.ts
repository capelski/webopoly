import { AnswerType, NotificationType, OfferType, PromptType } from '../enums';
import { getCurrentPlayer } from '../logic';
import { AnswerOfferPrompt, Game, Id, PropertySquare } from '../types';

export const triggerAcceptOffer = (game: Game, prompt: AnswerOfferPrompt): Game => {
  const { buyerId, sellerId } =
    prompt.offerType === OfferType.sell
      ? { buyerId: prompt.targetPlayerId, sellerId: prompt.playerId }
      : { buyerId: prompt.playerId, sellerId: prompt.targetPlayerId };

  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        amount: prompt.amount,
        answer: AnswerType.accept,
        offerType: prompt.offerType,
        playerId: prompt.targetPlayerId,
        propertyId: prompt.propertyId,
        targetPlayerId: prompt.playerId,
        type: NotificationType.answerOffer,
      },
    ],
    squares: game.squares.map((s) => {
      return s.id === prompt.propertyId ? { ...s, ownerId: buyerId } : s;
    }),
    players: game.players.map((p) => {
      return p.id === buyerId
        ? {
            ...p,
            properties: p.properties.concat(prompt.propertyId),
            money: p.money - prompt.amount,
          }
        : p.id === sellerId
        ? {
            ...p,
            properties: p.properties.filter((pId) => pId !== prompt.propertyId),
            money: p.money + prompt.amount,
          }
        : p;
    }),
  };
};

export const triggerBuyingOffer = (game: Game, property: PropertySquare, amount: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  if (currentPlayer.money < amount || property.ownerId === undefined) {
    return game;
  }

  return {
    ...game,
    status: {
      amount,
      offerType: OfferType.buy,
      playerId: currentPlayer.id,
      propertyId: property.id,
      targetPlayerId: property.ownerId,
      type: PromptType.answerOffer,
    },
  };
};

export const triggerDeclineOffer = (game: Game, prompt: AnswerOfferPrompt): Game => {
  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        amount: prompt.amount,
        answer: AnswerType.decline,
        offerType: prompt.offerType,
        playerId: prompt.targetPlayerId,
        propertyId: prompt.propertyId,
        targetPlayerId: prompt.playerId,
        type: NotificationType.answerOffer,
      },
    ],
  };
};

export const triggerSellingOffer = (
  game: Game,
  property: PropertySquare,
  amount: number,
  targetPlayerId: Id,
): Game => {
  return {
    ...game,
    status: {
      amount,
      offerType: OfferType.sell,
      playerId: game.currentPlayerId,
      propertyId: property.id,
      targetPlayerId,
      type: PromptType.answerOffer,
    },
  };
};
