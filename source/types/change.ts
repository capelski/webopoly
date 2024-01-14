import { ChangeType } from '../enums';
import { Dice } from './dice';
import { Id } from './id';

export type BaseChange = {
  playerId: Id;
};

export type CardChange = BaseChange & {
  cardId: Id;
  type: ChangeType.chance | ChangeType.communityChest;
};

export type GenericChange = BaseChange & {
  type:
    | ChangeType.bankruptcy
    | ChangeType.endTurn
    | ChangeType.getOutOfJail
    | ChangeType.goToJail
    | ChangeType.passGo
    | ChangeType.playerWin;
};

export type PropertyChange = BaseChange & {
  propertyId: Id;
  type:
    | ChangeType.buildHouse
    | ChangeType.buyProperty
    | ChangeType.clearMortgage
    | ChangeType.mortgage
    | ChangeType.sellHouse;
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

export type RollDiceChange = BaseChange & {
  dice: Dice;
  type: ChangeType.rollDice;
};

export type Change =
  | CardChange
  | FreeParkingChange
  | GenericChange
  | PayRentChange
  | PayTaxChange
  | PropertyChange
  | RemainsInJailChange
  | RollDiceChange;
