import { AnswerType, CardType, EventSource, EventType, JailMedium, OfferType } from '../enums';
import { Id } from './id';

type EventBase = {
  playerId: Id;
};

export type AnswerOfferEvent = EventBase & {
  amount: number;
  answer: AnswerType;
  offerType: OfferType;
  propertyId: Id;
  targetPlayerId: Id;
  type: EventType.answerOffer;
};

export type BankruptcyEvent = EventBase & {
  creditorId: Id | undefined;
  type: EventType.bankruptcy;
};

export type CardEvent = EventBase & {
  cardId: Id;
  cardType: CardType;
  type: EventType.card;
};

type ExpenseEventBase = EventBase & {
  amount: number;
  type: EventType.expense;
};

export type ExpenseCardEvent = ExpenseEventBase & {
  cardId: Id;
  source: EventSource.chanceCard | EventSource.communityChestCard;
};

export type ExpenseTaxEvent = ExpenseEventBase & {
  source: EventSource.taxSquare;
};

export type ExpenseEvent = ExpenseCardEvent | ExpenseTaxEvent;

export type FreeParkingEvent = EventBase & {
  pot: number;
  type: EventType.freeParking;
};

export type GenericEvent = EventBase & {
  type: EventType.passGo;
};

export type GetOutOfJailEvent = EventBase & {
  medium: JailMedium;
  type: EventType.getOutOfJail;
};

export type GoToJailEvent = EventBase & {
  source: EventSource;
  type: EventType.goToJail;
};

export type PayRentEvent = EventBase & {
  amount: number;
  landlordId: Id;
  type: EventType.payRent;
};

export type PropertyEventType =
  | EventType.buildHouse
  | EventType.buyProperty
  | EventType.clearMortgage
  | EventType.mortgage
  | EventType.sellHouse;

export type PropertyEvent = EventBase & {
  propertyId: Id;
  type: PropertyEventType;
};

export type TurnInJailEvent = EventBase & {
  turnsInJail: number;
  type: EventType.turnInJail;
};

export type Notification =
  | AnswerOfferEvent
  | BankruptcyEvent
  | CardEvent
  | ExpenseEvent
  | FreeParkingEvent
  | GenericEvent
  | GetOutOfJailEvent
  | GoToJailEvent
  | PayRentEvent
  | PropertyEvent
  | TurnInJailEvent;
