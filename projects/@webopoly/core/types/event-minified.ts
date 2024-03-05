import { AnswerType, CardType, EventType, JailMedium, OfferType } from '../enums';
import { Card } from './card';
import { PropertyEventType } from './event';
import { Player } from './player';
import { Square } from './square';

type EventBaseMinified = {
  /** playerId */
  p: Player['id'];
};

export type AnswerOfferEventMinified = EventBaseMinified & {
  /** amount */
  a: number;
  /** an */
  an: AnswerType;
  /** offerType */
  o: OfferType;
  /** propertyId */
  pi: Square['id'];
  /** type */
  t: EventType.answerOffer;
  /** targetPlayerId */
  tp: Player['id'];
};

export type AnswerTradeEventMinified = EventBaseMinified & {
  /** answer */
  an: AnswerType;
  /*playerPropertiesId **/
  ppi: Square['id'][];
  /** targetPlayerId */
  tpl: Player['id'];
  /** targetPropertiesId */
  tpp: Square['id'][];
  /** type */
  t: EventType.answerTrade;
};

export type BankruptcyEventMinified = EventBaseMinified & {
  /** creditor */
  ci: Player['id'] | undefined;
  /** type */
  t: EventType.bankruptcy;
};

export type CardEventMinified<TCard extends CardType = CardType> = EventBaseMinified & {
  /** amount */
  a: TCard extends CardType.streetRepairs ? number : undefined;
  /** cardId */
  ci: Card['id'];
  /** type */
  t: EventType.card;
};

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
  l: Player['id'];
  /** type */
  t: EventType.payRent;
};

export type PayTaxEventMinified = EventBaseMinified & {
  /** amount */
  a: number;
  /** type */
  t: EventType.payTax;
};

export type PropertyEventMinified = EventBaseMinified & {
  /** propertyId */
  pi: Square['id'];
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
