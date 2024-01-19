import { NotificationUiUpdate } from './notification-ui-update';
import { PromptUiUpdate } from './prompt-ui-update';
import { SilentUiUpdate } from './silent-ui-update';

export type UiUpdate = NotificationUiUpdate | PromptUiUpdate | SilentUiUpdate;

export type SplitUiUpdates = {
  currentUpdates: UiUpdate[];
  pendingUpdates: UiUpdate[];
};

export * from './notification-ui-update';
export * from './prompt-ui-update';
export * from './silent-ui-update';
