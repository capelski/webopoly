import { PromptType } from '../../enums';
import { AnswerOfferPrompt } from './answer-offer-prompt';
import { CannotPayPrompt } from './cannot-pay-prompt';
import { CardPrompt } from './card-prompt';
import { GoToJailPrompt } from './go-to-jail-prompt';
import { JailOptionsPrompt } from './jail-options-prompt';
import { PlayerWinsPrompt } from './player-wins-prompt';
import { PromptInterface } from './prompt-interface';

export const promptsMap: {
  [TKey in PromptType]: PromptInterface<TKey>;
} = {
  [PromptType.answerOffer]: AnswerOfferPrompt,
  [PromptType.cannotPay]: CannotPayPrompt,
  [PromptType.card]: CardPrompt,
  [PromptType.goToJail]: GoToJailPrompt,
  [PromptType.jailOptions]: JailOptionsPrompt,
  [PromptType.playerWins]: PlayerWinsPrompt,
};
