import { AnswerType, NotificationType, OfferType } from '../enums';
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

export type CardNotification = NotificationBase & {
  cardId: Id;
  type: NotificationType.chance | NotificationType.communityChest;
};

export type FreeParkingNotification = NotificationBase & {
  pot: number;
  type: NotificationType.freeParking;
};

export type GenericNotificationType =
  | NotificationType.bankruptcy
  | NotificationType.getOutOfJail
  | NotificationType.goToJail
  | NotificationType.passGo;

export type GenericNotification = NotificationBase & {
  type: GenericNotificationType;
};

export type PayRentNotification = NotificationBase & {
  landlordId: Id;
  rent: number;
  type: NotificationType.payRent;
};

export type PayTaxNotification = NotificationBase & {
  tax: number;
  type: NotificationType.payTax;
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

export type RemainsInJailNotification = NotificationBase & {
  turnsInJail: number;
  type: NotificationType.remainInJail;
};

export type Notification =
  | AnswerOfferNotification
  | CardNotification
  | FreeParkingNotification
  | GenericNotification
  | PayRentNotification
  | PayTaxNotification
  | PropertyNotification
  | RemainsInJailNotification;
