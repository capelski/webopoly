import { ChangeType, PromptType, UiUpdateType } from '../../enums';
import { Change } from '../change';

export type AcceptDeclinePrompt = Change & {
  promptType: PromptType.acceptDecline;
  type: ChangeType.placeOffer;
  uiUpdateType: UiUpdateType.prompt;
};

export type CardPrompt = Change & {
  promptType: PromptType.card;
  type: ChangeType.chance | ChangeType.communityChest;
  uiUpdateType: UiUpdateType.prompt;
};

export type ConfirmationPrompt = Change & {
  promptType: PromptType.confirmation;
  type: ChangeType.goToJail;
  uiUpdateType: UiUpdateType.prompt;
};

export type PromptUiUpdate = AcceptDeclinePrompt | CardPrompt | ConfirmationPrompt;
