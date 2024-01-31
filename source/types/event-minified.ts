import { AnswerType, CardType, EventSource, EventType, JailMedium, OfferType } from '../enums';
import { PropertyNotificationType } from './event';
import { Id } from './id';

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
  t: EventType.answerOffer;
  /** targetPlayerId */
  tp: Id;
};

export type BankruptcyNotificationMinified = NotificationBaseMinified & {
  /** creditor */
  ci: Id | undefined;
  /** type */
  t: EventType.bankruptcy;
};

export type CardNotificationMinified = NotificationBaseMinified & {
  /** cardId */
  ci: Id;
  /** cardType */
  ct: CardType;
  /** type */
  t: EventType.card;
};

type ExpenseNotificationBaseMinified = NotificationBaseMinified & {
  /** amount */
  a: number;
  /** type */
  t: EventType.expense;
};

export type ExpenseCardNotificationMinified = ExpenseNotificationBaseMinified & {
  /** cardId */
  ci: Id;
  /** source */
  s: EventSource.chanceCard | EventSource.communityChestCard;
};

export type ExpenseTaxNotificationMinified = ExpenseNotificationBaseMinified & {
  /** source */
  s: EventSource.taxSquare;
};

export type ExpenseNotificationMinified =
  | ExpenseCardNotificationMinified
  | ExpenseTaxNotificationMinified;

export type FreeParkingNotificationMinified = NotificationBaseMinified & {
  /** pot */
  po: number;
  /** type */
  t: EventType.freeParking;
};

export type GenericNotificationMinified = NotificationBaseMinified & {
  /** type */
  t: EventType.passGo;
};

export type GetOutOfJailNotificationMinified = NotificationBaseMinified & {
  /** medium */
  m: JailMedium;
  /** type*/
  t: EventType.getOutOfJail;
};

export type GoToJailNotificationMinified = NotificationBaseMinified & {
  /** source */
  s: EventSource;
  /** type */
  t: EventType.goToJail;
};

export type PayRentNotificationMinified = NotificationBaseMinified & {
  /** amount */
  a: number;
  /** landlordId */
  l: Id;
  /** type */
  t: EventType.payRent;
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
  t: EventType.turnInJail;
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
