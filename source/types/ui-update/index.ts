import { NotificationUiUpdate } from './notification-ui-update';
import { PromptUiUpdate } from './prompt-ui-update';

export type UiUpdate = NotificationUiUpdate | PromptUiUpdate;

export type SplitUiUpdates = {
  currentUpdates: UiUpdate[];
  pendingUpdates: UiUpdate[];
};

export * from './notification-ui-update';
export * from './prompt-ui-update';
