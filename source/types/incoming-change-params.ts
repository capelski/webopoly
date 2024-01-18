import { AnswerType, ChangeUiType, ModalType } from '../enums';

export type AcceptDeclineModalParams = {
  offerAnswer: AnswerType;
};

export type IncomingChangeParams =
  | {
      uiType: ChangeUiType.silent | ChangeUiType.toast;
      params?: undefined;
    }
  | ({
      uiType: ChangeUiType.modal;
    } & (
      | {
          modalType: ModalType.acceptDeclineModal;
          params: AcceptDeclineModalParams;
        }
      | { modalType: ModalType.cardModal | ModalType.okModal; params?: undefined }
    ));
