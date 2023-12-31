import { GameEventType } from '../enums';
import { Id } from './id';

export type GameEventBase = {
  playerId: Id;
};

export type CardEvent = GameEventBase & {
  cardId: Id;
  type: GameEventType.chance | GameEventType.communityChest;
};

export type GenericEvent = GameEventBase & {
  type:
    | GameEventType.bankruptcy
    | GameEventType.goToJail
    | GameEventType.passGo
    | GameEventType.playerWin;
};

export type PropertyEvent = GameEventBase & {
  propertyId: Id;
  type:
    | GameEventType.buildHouse
    | GameEventType.buyProperty
    | GameEventType.clearMortgage
    | GameEventType.mortgage
    | GameEventType.sellHouse;
};

export type FreeParkingEvent = GameEventBase & {
  pot: number;
  type: GameEventType.freeParking;
};

export type PayRentEvent = GameEventBase & {
  landlordId: Id;
  rent: number;
  type: GameEventType.payRent;
};

export type PayTaxEvent = GameEventBase & {
  tax: number;
  type: GameEventType.payTax;
};

export type RemainsInJailEvent = GameEventBase & {
  turnsInJail: number;
  type: GameEventType.remainInJail;
};

export type RollDiceEvent = GameEventBase & {
  dice: string;
  squareId: Id;
  type: GameEventType.getOutOfJail | GameEventType.rollDice;
};

export type GameEvent =
  | CardEvent
  | FreeParkingEvent
  | GenericEvent
  | PayRentEvent
  | PayTaxEvent
  | PropertyEvent
  | RemainsInJailEvent
  | RollDiceEvent;
