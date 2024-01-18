import { AnswerType, ChangeType, ChangeUiType, ModalType, OfferType } from '../enums';
import { getCurrentPlayer } from '../logic';
import { AcceptDeclineModalChange, Game, Id, PropertySquare } from '../types';

export const triggerAcceptOffer = (game: Game, change: AcceptDeclineModalChange): Game => {
  const { buyerId, sellerId } =
    change.offerType === OfferType.sell
      ? { buyerId: change.targetPlayerId, sellerId: change.playerId }
      : { buyerId: change.playerId, sellerId: change.targetPlayerId };

  return {
    ...game,
    incomingChanges: [
      {
        amount: change.amount,
        answer: AnswerType.accept,
        offerType: change.offerType,
        playerId: change.targetPlayerId,
        propertyId: change.propertyId,
        targetPlayerId: change.playerId,
        type: ChangeType.answerOffer,
        uiType: ChangeUiType.toast,
      },
    ],
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
  };
};

export const triggerBuyingOffer = (game: Game, property: PropertySquare, amount: number): Game => {
  const currentPlayer = getCurrentPlayer(game);
  if (currentPlayer.money < amount || property.ownerId === undefined) {
    return game;
  }

  return {
    ...game,
    incomingChanges: [
      {
        amount,
        modalType: ModalType.acceptDeclineModal,
        offerType: OfferType.buy,
        playerId: currentPlayer.id,
        propertyId: property.id,
        targetPlayerId: property.ownerId,
        type: ChangeType.placeOffer,
        uiType: ChangeUiType.modal,
      },
    ],
  };
};

export const triggerDeclineOffer = (game: Game, change: AcceptDeclineModalChange): Game => {
  return {
    ...game,
    incomingChanges: [
      {
        amount: change.amount,
        answer: AnswerType.decline,
        offerType: change.offerType,
        playerId: change.targetPlayerId,
        propertyId: change.propertyId,
        targetPlayerId: change.playerId,
        type: ChangeType.answerOffer,
        uiType: ChangeUiType.toast,
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
    incomingChanges: [
      {
        amount,
        modalType: ModalType.acceptDeclineModal,
        offerType: OfferType.sell,
        playerId: game.currentPlayerId,
        propertyId: property.id,
        targetPlayerId,
        type: ChangeType.placeOffer,
        uiType: ChangeUiType.modal,
      },
    ],
  };
};
