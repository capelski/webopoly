import { Change } from './change';
import { Dice } from './dice';
import { Id } from './id';
import { Player } from './player';
import { Square } from './square';
import { UiUpdate } from './ui-update';

export type Game = {
  centerPot: number;
  changeHistory: Change[];
  currentPlayerId: Id;
  dice: Dice;
  players: Player[];
  squares: Square[];
  uiUpdates: UiUpdate[];
};
