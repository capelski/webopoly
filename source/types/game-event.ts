import { GameEventType } from '../enums';
import { Id } from './id';

export type GameEventBase = { playerId: Id };

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

export type SquareEvent = GameEventBase & {
  squareId: Id;
  type: GameEventType.buyProperty | GameEventType.clearMortgage | GameEventType.mortgage;
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
  | RemainsInJailEvent
  | RollDiceEvent
  | SquareEvent;

export type TypedGameEvent<T extends GameEventType> = T extends GameEventType.bankruptcy
  ? GenericEvent
  : T extends GameEventType.buyProperty
  ? SquareEvent
  : T extends GameEventType.chance
  ? CardEvent
  : T extends GameEventType.clearMortgage
  ? SquareEvent
  : T extends GameEventType.communityChest
  ? CardEvent
  : T extends GameEventType.freeParking
  ? FreeParkingEvent
  : T extends GameEventType.getOutOfJail
  ? RollDiceEvent
  : T extends GameEventType.goToJail
  ? GenericEvent
  : T extends GameEventType.mortgage
  ? SquareEvent
  : T extends GameEventType.passGo
  ? GenericEvent
  : T extends GameEventType.payRent
  ? PayRentEvent
  : T extends GameEventType.payTax
  ? PayTaxEvent
  : T extends GameEventType.playerWin
  ? GenericEvent
  : T extends GameEventType.remainInJail
  ? RemainsInJailEvent
  : T extends GameEventType.rollDice
  ? RollDiceEvent
  : never;
