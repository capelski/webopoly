import { OfferType, PromptType } from '../enums';
import { Id } from './id';

export type CardPrompt = {
  cardId: Id;
  cardType: 'chance' | 'community';
  type: PromptType.card;
};

export type GenericPrompt = {
  type: PromptType.goToJail;
};

export type JailOptionsPrompt = {
  hasRolledDice: boolean;
  type: PromptType.jailOptions;
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
  | CardPrompt
  | GenericPrompt
  | JailOptionsPrompt
  | PlayerWinPrompt
  | AnswerOfferPrompt;
