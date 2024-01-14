import { GamePhase } from '../enums';
import { Change } from './change';
import { Dice } from './dice';
import { Id } from './id';
import { IncomingChange } from './incoming-change';
import { Player } from './player';
import { Square } from './square';

export type Game = {
  centerPot: number;
  changeHistory: Change[];
  currentPlayerId: Id;
  dice: Dice;
  gamePhase: GamePhase;
  incomingChanges: IncomingChange[];
  players: Player[];
  squares: Square[];
};
