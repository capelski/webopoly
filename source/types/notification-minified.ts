import {
  AnswerType,
  CardType,
  JailMedium,
  NotificationSource,
  NotificationType,
  OfferType,
} from '../enums';
import { Id } from './id';
import { GenericNotificationType, PropertyNotificationType } from './notification';

type BaseNotificationMinified = {
  /** playerId */
  p: Id;
};

export type AnswerOfferNotificationMinified = BaseNotificationMinified & {
  /** amount */
  a: number;
  /** an */
  an: AnswerType;
  /** offerType */
  o: OfferType;
  /** propertyId */
  pi: Id;
  /** type */
  t: NotificationType.answerOffer;
  /** targetPlayerId */
  tp: Id;
};

export type CardNotificationMinified = BaseNotificationMinified & {
  /** cardId */
  ci: Id;
  /** cardType */
  ct: CardType;
  /** type */
  t: NotificationType.card;
};

export type ExpenseNotificationMinified = BaseNotificationMinified & {
  /** amount */
  a: number;
  /** type */
  t: NotificationType.expense;
} & (
    | {
        /** cardId */
        ci: Id;
        /** source */
        s: NotificationSource.chanceCard | NotificationSource.communityCard;
      }
    | {
        /** source */
        s: NotificationSource.taxSquare;
      }
  );

export type FreeParkingNotificationMinified = BaseNotificationMinified & {
  /** pot */
  po: number;
  /** type */
  t: NotificationType.freeParking;
};

export type GenericNotificationMinified = BaseNotificationMinified & {
  /** type */
  t: GenericNotificationType;
};

export type GetOutOfJailNotificationMinified = BaseNotificationMinified & {
  /** medium */
  m: JailMedium;
  /** type*/
  t: NotificationType.getOutOfJail;
};

export type GoToJailNotificationMinified = BaseNotificationMinified & {
  /** source */
  s: NotificationSource;
  /** type */
  t: NotificationType.goToJail;
};

export type PayRentNotificationMinified = BaseNotificationMinified & {
  /** landlordId */
  l: Id;
  /** rent */
  r: number;
  /** type */
  t: NotificationType.payRent;
};

export type PropertyNotificationMinified = BaseNotificationMinified & {
  /** propertyId */
  pi: Id;
  /** type */
  t: PropertyNotificationType;
};

export type TurnInJailNotificationMinified = BaseNotificationMinified & {
  /** turnsInJail */
  tj: number;
  /** type */
  t: NotificationType.turnInJail;
};

export type NotificationMinified =
  | AnswerOfferNotificationMinified
  | CardNotificationMinified
  | ExpenseNotificationMinified
  | FreeParkingNotificationMinified
  | GenericNotificationMinified
  | GetOutOfJailNotificationMinified
  | GoToJailNotificationMinified
  | PayRentNotificationMinified
  | PropertyNotificationMinified
  | TurnInJailNotificationMinified;
