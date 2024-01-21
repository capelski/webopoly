import { ChangeType, UiUpdateType } from '../../enums';
import { Change } from '../change';

export type SilentUiUpdate = Change & {
  type: ChangeType.goToJail;
  uiUpdateType: UiUpdateType.silent;
};
