import { AnswerType, CardType, EventSource, EventType, JailMedium, OfferType } from '../enums';
import { Id } from './id';

type NotificationBase = {
  playerId: Id;
};

export type AnswerOfferNotification = NotificationBase & {
  amount: number;
  answer: AnswerType;
  offerType: OfferType;
  propertyId: Id;
  targetPlayerId: Id;
  type: EventType.answerOffer;
};

export type BankruptcyNotification = NotificationBase & {
  creditorId: Id | undefined;
  type: EventType.bankruptcy;
};

export type CardNotification = NotificationBase & {
  cardId: Id;
  cardType: CardType;
  type: EventType.card;
};

type ExpenseNotificationBase = NotificationBase & {
  amount: number;
  type: EventType.expense;
};

export type ExpenseCardNotification = ExpenseNotificationBase & {
  cardId: Id;
  source: EventSource.chanceCard | EventSource.communityChestCard;
};

export type ExpenseTaxNotification = ExpenseNotificationBase & {
  source: EventSource.taxSquare;
};

export type ExpenseNotification = ExpenseCardNotification | ExpenseTaxNotification;

export type FreeParkingNotification = NotificationBase & {
  pot: number;
  type: EventType.freeParking;
};

export type GenericNotification = NotificationBase & {
  type: EventType.passGo;
};

export type GetOutOfJailNotification = NotificationBase & {
  medium: JailMedium;
  type: EventType.getOutOfJail;
};

export type GoToJailNotification = NotificationBase & {
  source: EventSource;
  type: EventType.goToJail;
};

export type PayRentNotification = NotificationBase & {
  amount: number;
  landlordId: Id;
  type: EventType.payRent;
};

export type PropertyNotificationType =
  | EventType.buildHouse
  | EventType.buyProperty
  | EventType.clearMortgage
  | EventType.mortgage
  | EventType.sellHouse;

export type PropertyNotification = NotificationBase & {
  propertyId: Id;
  type: PropertyNotificationType;
};

export type TurnInJailNotification = NotificationBase & {
  turnsInJail: number;
  type: EventType.turnInJail;
};

export type Notification =
  | AnswerOfferNotification
  | BankruptcyNotification
  | CardNotification
  | ExpenseNotification
  | FreeParkingNotification
  | GenericNotification
  | GetOutOfJailNotification
  | GoToJailNotification
  | PayRentNotification
  | PropertyNotification
  | TurnInJailNotification;
