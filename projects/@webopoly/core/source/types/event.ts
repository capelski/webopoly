import { AnswerType, CardType, EventType, JailMedium, OfferType } from '../enums';
import { Card } from './card';
import { Player } from './player';
import { Square } from './square';

export type EventBase = {
  playerId: Player['id'];
};

export type AnswerOfferEvent = EventBase & {
  amount: number;
  answer: AnswerType;
  offerType: OfferType;
  propertyId: Square['id'];
  targetPlayerId: Player['id'];
  type: EventType.answerOffer;
};

export type AnswerTradeEvent = EventBase & {
  answer: AnswerType;
  playerPropertiesId: Square['id'][];
  targetPlayerId: Player['id'];
  targetPropertiesId: Square['id'][];
  type: EventType.answerTrade;
};

export type BankruptcyEvent = EventBase & {
  creditorId: Player['id'] | undefined;
  type: EventType.bankruptcy;
};

export type CardEvent<TCard extends CardType = CardType> = EventBase & {
  amount: TCard extends CardType.streetRepairs ? number : undefined;
  cardId: Card['id'];
  type: EventType.card;
};

export type FreeParkingEvent = EventBase & {
  pot: number;
  type: EventType.freeParking;
};

export type GenericEvent<T extends EventType.goToJail | EventType.passGo | EventType.playerExit> =
  EventBase & {
    type: T;
  };

export type GetOutOfJailEvent = EventBase & {
  medium: JailMedium;
  type: EventType.getOutOfJail;
};

export type PayRentEvent = EventBase & {
  amount: number;
  landlordId: Player['id'];
  type: EventType.payRent;
};

export type PayTaxEvent = EventBase & {
  amount: number;
  type: EventType.payTax;
};

export type PropertyEventType =
  | EventType.buildHouse
  | EventType.buyProperty
  | EventType.clearMortgage
  | EventType.mortgage
  | EventType.sellHouse;

export type PropertyEvent = EventBase & {
  propertyId: Square['id'];
  type: PropertyEventType;
};

export type TurnInJailEvent = EventBase & {
  turnsInJail: number;
  type: EventType.turnInJail;
};

export type PendingEvent = CardEvent | PayRentEvent | PayTaxEvent | TurnInJailEvent;

/** The Event type already exists in Typescript. Using GEvent instead (i.e. GameEvent) */
export type GEvent =
  | AnswerOfferEvent
  | AnswerTradeEvent
  | BankruptcyEvent
  | FreeParkingEvent
  | GenericEvent<EventType.goToJail>
  | GenericEvent<EventType.passGo>
  | GenericEvent<EventType.playerExit>
  | GetOutOfJailEvent
  | PendingEvent
  | PropertyEvent;
