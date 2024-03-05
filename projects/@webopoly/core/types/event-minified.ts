import { CardType, EventType } from '../enums';
import {
  AnswerOfferEvent,
  AnswerTradeEvent,
  BankruptcyEvent,
  CardEvent,
  EventBase,
  FreeParkingEvent,
  GenericEvent,
  GetOutOfJailEvent,
  PayRentEvent,
  PayTaxEvent,
  PropertyEvent,
  TurnInJailEvent,
} from './event';

type EventBaseMinified = {
  /** playerId */
  p: EventBase['playerId'];
};

export type AnswerOfferEventMinified = EventBaseMinified & {
  /** amount */
  a: AnswerOfferEvent['amount'];
  /** answer */
  an: AnswerOfferEvent['answer'];
  /** offerType */
  o: AnswerOfferEvent['offerType'];
  /** propertyId */
  pi: AnswerOfferEvent['propertyId'];
  /** type */
  t: AnswerOfferEvent['type'];
  /** targetPlayerId */
  tp: AnswerOfferEvent['targetPlayerId'];
};

export type AnswerTradeEventMinified = EventBaseMinified & {
  /** answer */
  an: AnswerTradeEvent['answer'];
  /*playerPropertiesId **/
  ppi: AnswerTradeEvent['playerPropertiesId'];
  /** targetPlayerId */
  tpl: AnswerTradeEvent['targetPlayerId'];
  /** targetPropertiesId */
  tpp: AnswerTradeEvent['targetPropertiesId'];
  /** type */
  t: AnswerTradeEvent['type'];
};

export type BankruptcyEventMinified = EventBaseMinified & {
  /** creditorId */
  ci: BankruptcyEvent['creditorId'];
  /** type */
  t: BankruptcyEvent['type'];
};

export type CardEventMinified<TCard extends CardType = CardType> = EventBaseMinified & {
  /** amount */
  a: CardEvent<TCard>['amount'];
  /** cardId */
  ci: CardEvent['cardId'];
  /** type */
  t: CardEvent['type'];
};

export type FreeParkingEventMinified = EventBaseMinified & {
  /** pot */
  po: FreeParkingEvent['pot'];
  /** type */
  t: FreeParkingEvent['type'];
};

export type GenericEventMinified = EventBaseMinified & {
  /** type */
  t: GenericEvent<EventType.goToJail | EventType.passGo>['type'];
};

export type GetOutOfJailEventMinified = EventBaseMinified & {
  /** medium */
  m: GetOutOfJailEvent['medium'];
  /** type*/
  t: GetOutOfJailEvent['type'];
};

export type PayRentEventMinified = EventBaseMinified & {
  /** amount */
  a: PayRentEvent['amount'];
  /** landlordId */
  l: PayRentEvent['landlordId'];
  /** type */
  t: PayRentEvent['type'];
};

export type PayTaxEventMinified = EventBaseMinified & {
  /** amount */
  a: PayTaxEvent['amount'];
  /** type */
  t: PayTaxEvent['type'];
};

export type PropertyEventMinified = EventBaseMinified & {
  /** propertyId */
  pi: PropertyEvent['propertyId'];
  /** type */
  t: PropertyEvent['type'];
};

export type TurnInJailEventMinified = EventBaseMinified & {
  /** turnsInJail */
  tj: TurnInJailEvent['turnsInJail'];
  /** type */
  t: TurnInJailEvent['type'];
};

export type EventMinified =
  | AnswerOfferEventMinified
  | AnswerTradeEventMinified
  | BankruptcyEventMinified
  | CardEventMinified
  | FreeParkingEventMinified
  | GenericEventMinified
  | GetOutOfJailEventMinified
  | PayRentEventMinified
  | PayTaxEventMinified
  | PropertyEventMinified
  | TurnInJailEventMinified;
