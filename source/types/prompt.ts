import { CardType, NotificationType, OfferType, PromptType } from '../enums';
import { Id } from './id';
import { Notification } from './notification';

export type CannotPayPrompt = {
  notification: Notification & { type: NotificationType.expense };
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

export type AnswerOfferPrompt = {
  amount: number;
  offerType: OfferType;
  playerId: Id;
  propertyId: Id;
  targetPlayerId: Id;
  type: PromptType.answerOffer;
};

export type Prompt =
  | CannotPayPrompt
  | CardPrompt
  | GenericPrompt
  | PlayerWinPrompt
  | AnswerOfferPrompt;
