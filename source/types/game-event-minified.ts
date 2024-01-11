import { GameEventType } from '../enums';
import { Dice } from './dice';
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
    | GameEventType.endTurn
    | GameEventType.getOutOfJail
    | GameEventType.goToJail
    | GameEventType.passGo
    | GameEventType.playerWin;
};

export type PropertyEventMinified = GameEventBaseMinified & {
  /** propertyId */
  pr: Id;
  /** type */
  t:
    | GameEventType.buildHouse
    | GameEventType.buyProperty
    | GameEventType.clearMortgage
    | GameEventType.mortgage
    | GameEventType.sellHouse;
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
  d: Dice;
  /** type */
  t: GameEventType.rollDice;
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
