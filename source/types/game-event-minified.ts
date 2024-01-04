import { GameEventType } from '../enums';
import { Id } from './id';

export type GameEventBaseMinified = {
  /** playerId */
  p: Id;
};

export type CardEventMinified = GameEventBaseMinified & {
  /** cardId */
  c: Id;
  /** type */
  t: GameEventType.chance | GameEventType.communityChest;
};

export type GenericEventMinified = GameEventBaseMinified & {
  /** type */
  t:
    | GameEventType.bankruptcy
    | GameEventType.goToJail
    | GameEventType.passGo
    | GameEventType.playerWin;
};

export type PropertyEventMinified = GameEventBaseMinified & {
  /** propertyId */
  pr: Id;
  /** type */
  t: GameEventType.buyProperty | GameEventType.clearMortgage | GameEventType.mortgage;
};

export type FreeParkingEventMinified = GameEventBaseMinified & {
  /** pot */
  po: number;
  /** type */
  t: GameEventType.freeParking;
};

export type PayRentEventMinified = GameEventBaseMinified & {
  /** landlordId */
  l: number;
  /** rent */
  r: number;
  /** type */
  t: GameEventType.payRent;
};

export type PayTaxEventMinified = GameEventBaseMinified & {
  /** tax */
  ta: number;
  /** type */
  t: GameEventType.payTax;
};

export type RemainsInJailEventMinified = GameEventBaseMinified & {
  /** turnsInJail */
  tj: number;
  /** type */
  t: GameEventType.remainInJail;
};

export type RollDiceEventMinified = GameEventBaseMinified & {
  /** dice */
  d: string;
  /** squareId */
  s: Id;
  /** type */
  t: GameEventType.getOutOfJail | GameEventType.rollDice;
};

export type GameEventMinified =
  | CardEventMinified
  | FreeParkingEventMinified
  | GenericEventMinified
  | PayRentEventMinified
  | PayTaxEventMinified
  | PropertyEventMinified
  | RemainsInJailEventMinified
  | RollDiceEventMinified;
