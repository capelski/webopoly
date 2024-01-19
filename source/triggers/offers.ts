import { AnswerType, ChangeType, OfferType, PromptType, UiUpdateType } from '../enums';
import { getCurrentPlayer } from '../logic';
import { AcceptDeclinePrompt, Game, Id, PropertySquare } from '../types';

export const triggerAcceptOffer = (game: Game, change: AcceptDeclinePrompt): Game => {
  const { buyerId, sellerId } =
    change.offerType === OfferType.sell
      ? { buyerId: change.targetPlayerId, sellerId: change.playerId }
      : { buyerId: change.playerId, sellerId: change.targetPlayerId };

  return {
    ...game,
    squares: game.squares.map((s) => {
      return s.id === change.propertyId ? { ...s, ownerId: buyerId } : s;
    }),
    players: game.players.map((p) => {
      return p.id === buyerId
        ? {
            ...p,
            properties: p.properties.concat(change.propertyId),
            money: p.money - change.amount,
          }
        : p.id === sellerId
        ? {
            ...p,
            properties: p.properties.filter((pId) => pId !== change.propertyId),
            money: p.money + change.amount,
          }
        : p;
    }),
    uiUpdates: [
      {
        amount: change.amount,
        answer: AnswerType.accept,
        offerType: change.offerType,
        playerId: change.targetPlayerId,
        propertyId: change.propertyId,
        targetPlayerId: change.playerId,
        type: ChangeType.answerOffer,
        uiUpdateType: UiUpdateType.notification,
      },
    ],
  };
};

export const triggerBuyingOffer = (game: Game, property: PropertySquare, amount: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  if (currentPlayer.money < amount || property.ownerId === undefined) {
    return game;
  }

  return {
    ...game,
    uiUpdates: [
      {
        amount,
        offerType: OfferType.buy,
        playerId: currentPlayer.id,
        promptType: PromptType.acceptDecline,
        propertyId: property.id,
        targetPlayerId: property.ownerId,
        type: ChangeType.placeOffer,
        uiUpdateType: UiUpdateType.prompt,
      },
    ],
  };
};

export const triggerDeclineOffer = (game: Game, change: AcceptDeclinePrompt): Game => {
  return {
    ...game,
    uiUpdates: [
      {
        amount: change.amount,
        answer: AnswerType.decline,
        offerType: change.offerType,
        playerId: change.targetPlayerId,
        propertyId: change.propertyId,
        targetPlayerId: change.playerId,
        type: ChangeType.answerOffer,
        uiUpdateType: UiUpdateType.notification,
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
    uiUpdates: [
      {
        amount,
        offerType: OfferType.sell,
        playerId: game.currentPlayerId,
        promptType: PromptType.acceptDecline,
        propertyId: property.id,
        targetPlayerId,
        type: ChangeType.placeOffer,
        uiUpdateType: UiUpdateType.prompt,
      },
    ],
  };
};
