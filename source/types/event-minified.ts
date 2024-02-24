import { AnswerType, CardType, EventSource, EventType, JailMedium, OfferType } from '../enums';
import { PropertyEventType } from './event';
import { Id } from './id';

type EventBaseMinified = {
  /** playerId */
  p: Id;
};

export type AnswerOfferEventMinified = EventBaseMinified & {
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

export type BankruptcyEventMinified = EventBaseMinified & {
  /** creditor */
  ci: Id | undefined;
  /** type */
  t: EventType.bankruptcy;
};

export type CardEventMinified<TCard extends CardType = CardType> = EventBaseMinified & {
  /** amount */
  a: TCard extends CardType.streetRepairs ? number : undefined;
  /** cardId */
  ci: Id;
  /** type */
  t: EventType.card;
};

type ExpenseEventBaseMinified = EventBaseMinified & {
  /** amount */
  a: number;
  /** type */
  t: EventType.expense;
};

export type ExpenseCardEventMinified = ExpenseEventBaseMinified & {
  /** cardId */
  ci: Id;
  /** source */
  s: EventSource.surpriseCard;
};

export type ExpenseTaxEventMinified = ExpenseEventBaseMinified & {
  /** source */
  s: EventSource.taxSquare;
};

export type ExpenseEventMinified = ExpenseCardEventMinified | ExpenseTaxEventMinified;

export type FreeParkingEventMinified = EventBaseMinified & {
  /** pot */
  po: number;
  /** type */
  t: EventType.freeParking;
};

export type GenericEventMinified = EventBaseMinified & {
  /** type */
  t: EventType.goToJail | EventType.passGo;
};

export type GetOutOfJailEventMinified = EventBaseMinified & {
  /** medium */
  m: JailMedium;
  /** type*/
  t: EventType.getOutOfJail;
};

export type PayRentEventMinified = EventBaseMinified & {
  /** amount */
  a: number;
  /** landlordId */
  l: Id;
  /** type */
  t: EventType.payRent;
};

export type PropertyEventMinified = EventBaseMinified & {
  /** propertyId */
  pi: Id;
  /** type */
  t: PropertyEventType;
};

export type TurnInJailEventMinified = EventBaseMinified & {
  /** turnsInJail */
  tj: number;
  /** type */
  t: EventType.turnInJail;
};

export type EventMinified =
  | AnswerOfferEventMinified
  | BankruptcyEventMinified
  | CardEventMinified
  | ExpenseEventMinified
  | FreeParkingEventMinified
  | GenericEventMinified
  | GetOutOfJailEventMinified
  | PayRentEventMinified
  | PropertyEventMinified
  | TurnInJailEventMinified;
