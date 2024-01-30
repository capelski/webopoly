import { CardType, NotificationType, OfferType, PromptType } from '../enums';
import { Id } from './id';
import { Notification } from './notification';

export type AnswerOfferPrompt = {
  amount: number;
  offerType: OfferType;
  playerId: Id;
  propertyId: Id;
  targetPlayerId: Id;
  type: PromptType.answerOffer;
};

export type CannotPayPrompt = {
  notification: Notification & {
    type: NotificationType.expense | NotificationType.getOutOfJail | NotificationType.payRent;
  };
  playerId: Id;
  type: PromptType.cannotPay;
};

export type CardPrompt = {
  cardId: Id;
  cardType: CardType;
  type: PromptType.card;
};

export type GenericPrompt = {
  type: PromptType.goToJail | PromptType.jailOptions;
};

export type PlayerWinPrompt = {
  playerId: Id;
  type: PromptType.playerWin;
};

export type Prompt =
  | AnswerOfferPrompt
  | CannotPayPrompt
  | CardPrompt
  | GenericPrompt
  | PlayerWinPrompt;
