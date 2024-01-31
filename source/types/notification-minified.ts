import {
  AnswerType,
  CardType,
  JailMedium,
  NotificationSource,
  NotificationType,
  OfferType,
} from '../enums';
import { Id } from './id';
import { PropertyNotificationType } from './notification';

type NotificationBaseMinified = {
  /** playerId */
  p: Id;
};

export type AnswerOfferNotificationMinified = NotificationBaseMinified & {
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

export type BankruptcyNotificationMinified = NotificationBaseMinified & {
  /** creditor */
  ci: Id | undefined;
  /** type */
  t: NotificationType.bankruptcy;
};

export type CardNotificationMinified = NotificationBaseMinified & {
  /** cardId */
  ci: Id;
  /** cardType */
  ct: CardType;
  /** type */
  t: NotificationType.card;
};

type ExpenseNotificationBaseMinified = NotificationBaseMinified & {
  /** amount */
  a: number;
  /** type */
  t: NotificationType.expense;
};

export type ExpenseCardNotificationMinified = ExpenseNotificationBaseMinified & {
  /** cardId */
  ci: Id;
  /** source */
  s: NotificationSource.chanceCard | NotificationSource.communityChestCard;
};

export type ExpenseTaxNotificationMinified = ExpenseNotificationBaseMinified & {
  /** source */
  s: NotificationSource.taxSquare;
};

export type ExpenseNotificationMinified =
  | ExpenseCardNotificationMinified
  | ExpenseTaxNotificationMinified;

export type FreeParkingNotificationMinified = NotificationBaseMinified & {
  /** pot */
  po: number;
  /** type */
  t: NotificationType.freeParking;
};

export type GenericNotificationMinified = NotificationBaseMinified & {
  /** type */
  t: NotificationType.passGo;
};

export type GetOutOfJailNotificationMinified = NotificationBaseMinified & {
  /** medium */
  m: JailMedium;
  /** type*/
  t: NotificationType.getOutOfJail;
};

export type GoToJailNotificationMinified = NotificationBaseMinified & {
  /** source */
  s: NotificationSource;
  /** type */
  t: NotificationType.goToJail;
};

export type PayRentNotificationMinified = NotificationBaseMinified & {
  /** amount */
  a: number;
  /** landlordId */
  l: Id;
  /** type */
  t: NotificationType.payRent;
};

export type PropertyNotificationMinified = NotificationBaseMinified & {
  /** propertyId */
  pi: Id;
  /** type */
  t: PropertyNotificationType;
};

export type TurnInJailNotificationMinified = NotificationBaseMinified & {
  /** turnsInJail */
  tj: number;
  /** type */
  t: NotificationType.turnInJail;
};

export type NotificationMinified =
  | AnswerOfferNotificationMinified
  | BankruptcyNotificationMinified
  | CardNotificationMinified
  | ExpenseNotificationMinified
  | FreeParkingNotificationMinified
  | GenericNotificationMinified
  | GetOutOfJailNotificationMinified
  | GoToJailNotificationMinified
  | PayRentNotificationMinified
  | PropertyNotificationMinified
  | TurnInJailNotificationMinified;
