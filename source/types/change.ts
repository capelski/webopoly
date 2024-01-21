import { AnswerType, ChangeType, OfferType } from '../enums';
import { Id } from './id';

export type BaseChange = {
  playerId: Id;
};

export type CardChange = BaseChange & {
  cardId: Id;
  type: ChangeType.chance | ChangeType.communityChest;
};

export type GenericChangeType =
  | ChangeType.bankruptcy
  | ChangeType.getOutOfJail
  | ChangeType.goToJail
  | ChangeType.passGo
  | ChangeType.playerWin
  | ChangeType.rollDice;

export type GenericChange = BaseChange & {
  type: GenericChangeType;
};

export type PropertyChangeType =
  | ChangeType.buildHouse
  | ChangeType.buyProperty
  | ChangeType.clearMortgage
  | ChangeType.mortgage
  | ChangeType.sellHouse;

export type PropertyChange = BaseChange & {
  propertyId: Id;
  type: PropertyChangeType;
};

export type FreeParkingChange = BaseChange & {
  pot: number;
  type: ChangeType.freeParking;
};

export type PayRentChange = BaseChange & {
  landlordId: Id;
  rent: number;
  type: ChangeType.payRent;
};

export type PayTaxChange = BaseChange & {
  tax: number;
  type: ChangeType.payTax;
};

export type RemainsInJailChange = BaseChange & {
  turnsInJail: number;
  type: ChangeType.remainInJail;
};

export type OfferBaseChange = BaseChange & {
  amount: number;
  offerType: OfferType;
  propertyId: Id;
  targetPlayerId: Id;
};

export type PlaceOfferChange = OfferBaseChange & {
  type: ChangeType.placeOffer;
};

export type AnswerOfferChange = OfferBaseChange & {
  answer: AnswerType;
  type: ChangeType.answerOffer;
};

export type Change =
  | CardChange
  | FreeParkingChange
  | GenericChange
  | PayRentChange
  | PayTaxChange
  | PropertyChange
  | RemainsInJailChange
  | PlaceOfferChange
  | AnswerOfferChange;
