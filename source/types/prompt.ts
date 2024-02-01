import { CardType, OfferType, PromptType } from '../enums';
import { GamePhase } from './game-phase';
import { Id } from './id';

export type AnswerOfferPrompt = {
  amount: number;
  offerType: OfferType;
  playerId: Id;
  previousPhase: GamePhase;
  propertyId: Id;
  targetPlayerId: Id;
  type: PromptType.answerOffer;
};

export type CannotPayPrompt = {
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
  type: PromptType.playerWins;
};

export type Prompt =
  | AnswerOfferPrompt
  | CannotPayPrompt
  | CardPrompt
  | GenericPrompt
  | PlayerWinPrompt;
