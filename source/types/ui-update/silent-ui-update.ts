import { ChangeType, UiUpdateType } from '../../enums';
import { Change } from '../change';

export type SilentUiUpdate = Change & {
  type: ChangeType.endTurn | ChangeType.goToJail | ChangeType.rollDice;
  uiUpdateType: UiUpdateType.silent;
};
