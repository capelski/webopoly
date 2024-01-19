import { AnswerType, PromptType, UiUpdateType } from '../enums';

export type AcceptDeclinePromptParams = {
  offerAnswer: AnswerType;
};

export type NonPromptUpdateParams = {
  uiUpdateType: UiUpdateType.silent | UiUpdateType.notification;
  params?: undefined;
};

export type PromptUpdateParams = {
  uiUpdateType: UiUpdateType.prompt;
} & (
  | {
      promptType: PromptType.acceptDecline;
      params: AcceptDeclinePromptParams;
    }
  | {
      promptType?: PromptType.card | PromptType.confirmation;
      params?: undefined;
    }
);

export type UiUpdateParams = NonPromptUpdateParams | PromptUpdateParams;
