import {
  AnswerType,
  CardType,
  JailMedium,
  NotificationSource,
  NotificationType,
  OfferType,
} from '../enums';
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
  type: NotificationType.answerOffer;
};

export type BankruptcyNotification = NotificationBase & {
  creditorId: Id | undefined;
  type: NotificationType.bankruptcy;
};

export type CardNotification = NotificationBase & {
  cardId: Id;
  cardType: CardType;
  type: NotificationType.card;
};

type ExpenseNotificationBase = NotificationBase & {
  amount: number;
  type: NotificationType.expense;
};

export type ExpenseCardNotification = ExpenseNotificationBase & {
  cardId: Id;
  source: NotificationSource.chanceCard | NotificationSource.communityChestCard;
};

export type ExpenseTaxNotification = ExpenseNotificationBase & {
  source: NotificationSource.taxSquare;
};

export type ExpenseNotification = ExpenseCardNotification | ExpenseTaxNotification;

export type FreeParkingNotification = NotificationBase & {
  pot: number;
  type: NotificationType.freeParking;
};

export type GenericNotification = NotificationBase & {
  type: NotificationType.passGo;
};

export type GetOutOfJailNotification = NotificationBase & {
  medium: JailMedium;
  type: NotificationType.getOutOfJail;
};

export type GoToJailNotification = NotificationBase & {
  source: NotificationSource;
  type: NotificationType.goToJail;
};

export type PayRentNotification = NotificationBase & {
  amount: number;
  landlordId: Id;
  type: NotificationType.payRent;
};

export type PropertyNotificationType =
  | NotificationType.buildHouse
  | NotificationType.buyProperty
  | NotificationType.clearMortgage
  | NotificationType.mortgage
  | NotificationType.sellHouse;

export type PropertyNotification = NotificationBase & {
  propertyId: Id;
  type: PropertyNotificationType;
};

export type TurnInJailNotification = NotificationBase & {
  turnsInJail: number;
  type: NotificationType.turnInJail;
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
