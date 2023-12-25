import { GameEventType } from '../enums';
import { Id } from './id';

export type GameEventBase = { playerId: Id };

export type BankruptcyEvent = GameEventBase & {
  type: GameEventType.bankruptcy;
};

export type BuyPropertyEvent = GameEventBase & {
  squareName: string; // TODO square id instead
  type: GameEventType.buyProperty;
};

export type ChanceEvent = GameEventBase & {
  cardId: Id;
  type: GameEventType.chance;
};

export type CommunityChestEvent = GameEventBase & {
  cardId: Id;
  type: GameEventType.communityChest;
};

export type FreeParkingEvent = GameEventBase & {
  pot: number;
  type: GameEventType.freeParking;
};

export type GetOutOfJailEvent = GameEventBase & {
  dice: string;
  squareName: string; // TODO square id instead
  type: GameEventType.getOutOfJail;
};

export type GoToJailEvent = GameEventBase & {
  type: GameEventType.goToJail;
};

export type PassGoEvent = GameEventBase & {
  type: GameEventType.passGo;
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

export type PlayerWinsEvent = GameEventBase & {
  type: GameEventType.playerWin;
};

export type RemainsInJailEvent = GameEventBase & {
  turnsInJail: number;
  type: GameEventType.remainInJail;
};

export type RollDiceEvent = GameEventBase & {
  dice: string;
  squareName: string; // TODO square id instead
  type: GameEventType.rollDice;
};

export type GameEvent =
  | BankruptcyEvent
  | BuyPropertyEvent
  | ChanceEvent
  | CommunityChestEvent
  | FreeParkingEvent
  | GetOutOfJailEvent
  | GoToJailEvent
  | PassGoEvent
  | PayRentEvent
  | PayTaxEvent
  | PlayerWinsEvent
  | RemainsInJailEvent
  | RollDiceEvent;

export type TypedGameEvent<T extends GameEventType> = T extends GameEventType.bankruptcy
  ? BankruptcyEvent
  : T extends GameEventType.buyProperty
  ? BuyPropertyEvent
  : T extends GameEventType.chance
  ? ChanceEvent
  : T extends GameEventType.communityChest
  ? CommunityChestEvent
  : T extends GameEventType.freeParking
  ? FreeParkingEvent
  : T extends GameEventType.getOutOfJail
  ? GetOutOfJailEvent
  : T extends GameEventType.goToJail
  ? GoToJailEvent
  : T extends GameEventType.passGo
  ? PassGoEvent
  : T extends GameEventType.payRent
  ? PayRentEvent
  : T extends GameEventType.payTax
  ? PayTaxEvent
  : T extends GameEventType.playerWin
  ? PlayerWinsEvent
  : T extends GameEventType.remainInJail
  ? RemainsInJailEvent
  : T extends GameEventType.rollDice
  ? RollDiceEvent
  : never;
