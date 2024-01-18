import { ChangeType, ChangeUiType, ModalType } from '../enums';
import { Change } from './change';

export type AcceptDeclineModalChange = Change & {
  modalType: ModalType.acceptDeclineModal;
  type: ChangeType.placeOffer;
  uiType: ChangeUiType.modal;
};

export type CardModalChange = Change & {
  modalType: ModalType.cardModal;
  type: ChangeType.chance | ChangeType.communityChest;
  uiType: ChangeUiType.modal;
};

export type OkModalChange = Change & {
  modalType: ModalType.okModal;
  type: ChangeType.goToJail;
  uiType: ChangeUiType.modal;
};

export type ModalChange = AcceptDeclineModalChange | CardModalChange | OkModalChange;

export type SilentChange = Change & {
  type: ChangeType.endTurn | ChangeType.goToJail | ChangeType.rollDice;
  uiType: ChangeUiType.silent;
};

export type ToastChange = Change & {
  type:
    | ChangeType.answerOffer
    | ChangeType.buildHouse
    | ChangeType.buyProperty
    | ChangeType.clearMortgage
    | ChangeType.freeParking
    | ChangeType.getOutOfJail
    | ChangeType.mortgage
    | ChangeType.passGo
    | ChangeType.payRent
    | ChangeType.payTax
    | ChangeType.remainInJail
    | ChangeType.sellHouse;
  uiType: ChangeUiType.toast;
};

export type IncomingChange = ModalChange | SilentChange | ToastChange;

export type SplitChanges = {
  currentChanges: IncomingChange[];
  pendingChanges: IncomingChange[];
};
