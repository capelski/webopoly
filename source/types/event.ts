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

export type CardEvent<TCard extends CardType = CardType> = EventBase & {
  amount: TCard extends CardType.streetRepairs ? number : undefined;
  cardId: Id;
  type: EventType.card;
};

type ExpenseEventBase = EventBase & {
  amount: number;
  type: EventType.expense;
};

export type ExpenseCardEvent = ExpenseEventBase & {
  cardId: Id;
  source: EventSource.surpriseCard;
};

export type ExpenseTaxEvent = ExpenseEventBase & {
  source: EventSource.taxSquare;
};

export type ExpenseEvent = ExpenseCardEvent | ExpenseTaxEvent;

export type FreeParkingEvent = EventBase & {
  pot: number;
  type: EventType.freeParking;
};

export type GenericEvent<T extends EventType.goToJail | EventType.passGo> = EventBase & {
  type: T;
};

export type GetOutOfJailEvent = EventBase & {
  medium: JailMedium;
  type: EventType.getOutOfJail;
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

export type PendingEvent = CardEvent | ExpenseEvent | PayRentEvent | TurnInJailEvent;

/** The Event type already exists in Typescript. Using GEvent instead (i.e. GameEvent) */
export type GEvent =
  | AnswerOfferEvent
  | BankruptcyEvent
  | FreeParkingEvent
  | GenericEvent<EventType.goToJail>
  | GenericEvent<EventType.passGo>
  | GetOutOfJailEvent
  | PendingEvent
  | PropertyEvent;
