import { OfferType, PromptType } from '../enums';
import { Id } from './id';

type PromptBase = {
  playerId: Id;
};

export type CardPrompt = PromptBase & {
  cardId: Id;
  type: PromptType.chance | PromptType.communityChest;
};

export type GenericPrompt = PromptBase & {
  type: PromptType.goToJail | PromptType.playerWin;
};

export type AnswerOfferPrompt = PromptBase & {
  amount: number;
  offerType: OfferType;
  propertyId: Id;
  targetPlayerId: Id;
  type: PromptType.answerOffer;
};

export type Prompt = CardPrompt | GenericPrompt | AnswerOfferPrompt;
