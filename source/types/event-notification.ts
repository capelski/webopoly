import { NotificationType } from '../enums';
import { GameEvent } from './game-event';

export type EventNotification = GameEvent & {
  notificationType: NotificationType;
};
