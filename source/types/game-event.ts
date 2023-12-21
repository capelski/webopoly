import { GameEventType } from '../enums';
import { Player } from './player';

// TODO Description can be computed

export type GameEvent = { description: string } & (
  | {
      type: GameEventType.bankruptcy;
    }
  | {
      type: GameEventType.buyProperty;
    }
  | {
      type: GameEventType.chance;
    }
  | {
      type: GameEventType.communityChest;
    }
  | {
      type: GameEventType.endTurn;
    }
  | {
      pot: number;
      type: GameEventType.freeParking;
    }
  | {
      type: GameEventType.getsOutOfJail;
    }
  | {
      type: GameEventType.goToJail;
    }
  | {
      type: GameEventType.passGo;
    }
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
      type: GameEventType.playerWins;
    }
  | {
      turnsInJail: number;
      type: GameEventType.remainsInJail;
    }
  | {
      type: GameEventType.rollDice;
    }
);
