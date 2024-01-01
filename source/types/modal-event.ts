import { ModalType } from '../enums';
import { CardEvent, GenericEvent } from './game-event';

export type TypedModalEvent<T extends ModalType> = T extends ModalType.cardModal
  ? CardEvent
  : T extends ModalType.okModal
  ? GenericEvent
  : never;
