import { OfferType, PromptType } from '../enums';
import { PendingEvent } from './event';
import { NonPromptPhasePayload, TradePhasePayload } from './game-phase-payload';
import { Id } from './id';

export type AnswerOfferPrompt = {
  amount: number;
  offerType: OfferType;
  playerId: Id;
  previous: NonPromptPhasePayload;
  propertyId: Id;
  targetPlayerId: Id;
  type: PromptType.answerOffer;
};

export type AnswerTradePrompt = {
  playerId: Id;
  playerPropertiesId: Id[];
  previous: TradePhasePayload['previousPhase'];
  targetPlayerId: Id;
  targetPropertiesId: Id[];
  type: PromptType.answerTrade;
};

export type BuyPropertyPrompt = {
  currentBuyerId: Id;
  potentialBuyersId: Id[];
  type: PromptType.buyProperty;
};

export type CannotPayPrompt = {
  pendingEvent: PendingEvent;
  type: PromptType.cannotPay;
};

export type CardPrompt = {
  cardId: Id;
  type: PromptType.card;
};

export type GenericPrompt = {
  type: PromptType.goToJail | PromptType.jailOptions;
};

export type PlayerWinPrompt = {
  playerId: Id;
  type: PromptType.playerWins;
};

export type Prompt<T extends PromptType> = (
  | AnswerOfferPrompt
  | AnswerTradePrompt
  | BuyPropertyPrompt
  | CannotPayPrompt
  | CardPrompt
  | GenericPrompt
  | PlayerWinPrompt
) & { type: T };