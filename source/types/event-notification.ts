import { ModalType, NotificationType } from '../enums';
import { GameEvent } from './game-event';

export type ModalNotification = {
  modalType: ModalType;
  notificationType: NotificationType.modal;
};

export type EventNotification = GameEvent &
  (
    | ModalNotification
    | {
        notificationType: NotificationType.silent | NotificationType.toast;
      }
  );
