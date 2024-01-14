import { ChangeType } from '../enums';
import { Dice } from './dice';
import { Id } from './id';

export type BaseChangeBaseMinified = {
  /** playerId */
  p: Id;
};

export type CardChangeMinified = BaseChangeBaseMinified & {
  /** cardId */
  c: Id;
  /** type */
  t: ChangeType.chance | ChangeType.communityChest;
};

export type GenericChangeMinified = BaseChangeBaseMinified & {
  /** type */
  t:
    | ChangeType.bankruptcy
    | ChangeType.endTurn
    | ChangeType.getOutOfJail
    | ChangeType.goToJail
    | ChangeType.passGo
    | ChangeType.playerWin;
};

export type PropertyChangeMinified = BaseChangeBaseMinified & {
  /** propertyId */
  pr: Id;
  /** type */
  t:
    | ChangeType.buildHouse
    | ChangeType.buyProperty
    | ChangeType.clearMortgage
    | ChangeType.mortgage
    | ChangeType.sellHouse;
};

export type FreeParkingChangeMinified = BaseChangeBaseMinified & {
  /** pot */
  po: number;
  /** type */
  t: ChangeType.freeParking;
};

export type PayRentChangeMinified = BaseChangeBaseMinified & {
  /** landlordId */
  l: number;
  /** rent */
  r: number;
  /** type */
  t: ChangeType.payRent;
};

export type PayTaxChangeMinified = BaseChangeBaseMinified & {
  /** tax */
  ta: number;
  /** type */
  t: ChangeType.payTax;
};

export type RemainsInJailChangeMinified = BaseChangeBaseMinified & {
  /** turnsInJail */
  tj: number;
  /** type */
  t: ChangeType.remainInJail;
};

export type RollDiceChangeMinified = BaseChangeBaseMinified & {
  /** dice */
  d: Dice;
  /** type */
  t: ChangeType.rollDice;
};

export type ChangeMinified =
  | CardChangeMinified
  | FreeParkingChangeMinified
  | GenericChangeMinified
  | PayRentChangeMinified
  | PayTaxChangeMinified
  | PropertyChangeMinified
  | RemainsInJailChangeMinified
  | RollDiceChangeMinified;
