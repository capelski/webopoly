import { OfferType, PromptType } from '../enums';
import { Card } from './card';
import { PendingEvent } from './event';
import { NonPromptPhasePayload, TradePhasePayload } from './game-phase-payload';
import { Player } from './player';
import { Square } from './square';

export type AnswerOfferPrompt = {
  amount: number;
  offerType: OfferType;
  playerId: Player['id'];
  previous: NonPromptPhasePayload;
  propertyId: Square['id'];
  targetPlayerId: Player['id'];
  type: PromptType.answerOffer;
};

export type AnswerTradePrompt = {
  playerId: Player['id'];
  playerPropertiesId: Square['id'][];
  previous: TradePhasePayload['previousPhase'];
  targetPlayerId: Player['id'];
  targetPropertiesId: Square['id'][];
  type: PromptType.answerTrade;
};

export type ApplyCardPrompt = {
  cardId: Card['id'];
  type: PromptType.applyCard;
};

export type BuyPropertyPrompt = {
  currentBuyerId: Player['id'];
  potentialBuyersId: Player['id'][];
  type: PromptType.buyProperty;
};

export type CannotPayPrompt = {
  pendingEvent: PendingEvent;
  type: PromptType.cannotPay;
};

export type GoToJailPrompt = {
  type: PromptType.goToJail;
};

export type DrawCardPrompt = {
  type: PromptType.drawCard;
};

export type JailOptionsPrompt = {
  type: PromptType.jailOptions;
};

export type PlayerWinPrompt = {
  playerId: Player['id'];
  type: PromptType.playerWins;
};

export type Prompt<T extends PromptType> = (
  | AnswerOfferPrompt
  | AnswerTradePrompt
  | ApplyCardPrompt
  | BuyPropertyPrompt
  | CannotPayPrompt
  | DrawCardPrompt
  | GoToJailPrompt
  | JailOptionsPrompt
  | PlayerWinPrompt
) & { type: T };
