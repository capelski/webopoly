import { ChangeUiType, ModalType } from '../enums';
import { CardChange, Change, GenericChange } from './change';

export type ModalChange = {
  modalType: ModalType;
  uiType: ChangeUiType.modal;
} & (CardChange | GenericChange);

export type SilentChange = Change & {
  uiType: ChangeUiType.silent;
};

export type ToastChange = Change & {
  uiType: ChangeUiType.toast;
};

export type IncomingChange = ModalChange | SilentChange | ToastChange;

export type SplitChanges = {
  currentChanges: IncomingChange[];
  pendingChanges: IncomingChange[];
};
