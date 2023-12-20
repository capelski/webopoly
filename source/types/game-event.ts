import { GameEventType } from '../enums';
import { Player } from './player';

// TODO Description can be computed

export type GameEvent = { description: string } & (
  | {
      landlord: Player;
      rent: number;
      type: GameEventType.payRent;
    }
  | {
      tax: number;
      type: GameEventType.payTax;
    }
  | {
      type: GameEventType.endTurn;
    }
  | {
      type: GameEventType.rollDice;
    }
  | {
      type: GameEventType.buyProperty;
    }
  | {
      type: GameEventType.passGo;
    }
  | {
      type: GameEventType.goToJail;
    }
  | {
      type: GameEventType.getsOutOfJail;
    }
  | {
      turnsInJail: number;
      type: GameEventType.remainsInJail;
    }
  | {
      type: GameEventType.bankruptcy;
    }
  | {
      pot: number;
      type: GameEventType.freeParking;
    }
);
