import { AnswerType, ChangeType, OfferType } from '../enums';
import { GenericChangeType, PropertyChangeType } from './change';
import { Id } from './id';

export type BaseChangeMinified = {
  /** playerId */
  p: Id;
};

export type CardChangeMinified = BaseChangeMinified & {
  /** cardId */
  c: Id;
  /** type */
  t: ChangeType.chance | ChangeType.communityChest;
};

export type GenericChangeMinified = BaseChangeMinified & {
  /** type */
  t: GenericChangeType;
};

export type PropertyChangeMinified = BaseChangeMinified & {
  /** propertyId */
  pi: Id;
  /** type */
  t: PropertyChangeType;
};

export type FreeParkingChangeMinified = BaseChangeMinified & {
  /** pot */
  po: number;
  /** type */
  t: ChangeType.freeParking;
};

export type PayRentChangeMinified = BaseChangeMinified & {
  /** landlordId */
  l: Id;
  /** rent */
  r: number;
  /** type */
  t: ChangeType.payRent;
};

export type PayTaxChangeMinified = BaseChangeMinified & {
  /** tax */
  ta: number;
  /** type */
  t: ChangeType.payTax;
};

export type RemainsInJailChangeMinified = BaseChangeMinified & {
  /** turnsInJail */
  tj: number;
  /** type */
  t: ChangeType.remainInJail;
};

export type OfferBaseChangeMinified = BaseChangeMinified & {
  /** amount */
  a: number;
  /** offerType */
  o: OfferType;
  /** propertyId */
  pi: Id;
  /** targetPlayerId */
  tp: Id;
};

export type PlaceOfferChangeMinified = OfferBaseChangeMinified & {
  /** type */
  t: ChangeType.placeOffer;
};

export type AnswerOfferChangeMinified = OfferBaseChangeMinified & {
  /** an */
  an: AnswerType;
  /** type */
  t: ChangeType.answerOffer;
};

export type ChangeMinified =
  | CardChangeMinified
  | FreeParkingChangeMinified
  | GenericChangeMinified
  | PayRentChangeMinified
  | PayTaxChangeMinified
  | PropertyChangeMinified
  | RemainsInJailChangeMinified
  | PlaceOfferChangeMinified
  | AnswerOfferChangeMinified;
