import { AnswerType, CardType, JailMedium, NotificationType, OfferType } from '../enums';
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
  cardType: CardType;
  type: NotificationType.card;
};

export type FreeParkingNotification = NotificationBase & {
  pot: number;
  type: NotificationType.freeParking;
};

export type GenericNotificationType =
  | NotificationType.bankruptcy
  | NotificationType.goToJail
  | NotificationType.passGo;

export type GenericNotification = NotificationBase & {
  type: GenericNotificationType;
};

export type GetOutOfJailNotification = NotificationBase & {
  medium: JailMedium;
  type: NotificationType.getOutOfJail;
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

export type TurnInJailNotification = NotificationBase & {
  turnsInJail: number;
  type: NotificationType.turnInJail;
};

export type Notification =
  | AnswerOfferNotification
  | CardNotification
  | FreeParkingNotification
  | GenericNotification
  | GetOutOfJailNotification
  | PayRentNotification
  | PayTaxNotification
  | PropertyNotification
  | TurnInJailNotification;
