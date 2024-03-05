import { PlayerStatus } from '../enums';
import { Player } from './player';
import { Square } from './square';

export type PlayerMinified = {
  /** color */
  c: string;
  /** getOutOfJail */
  g: number;
  /** id */
  i: Player['id'];
  /** isInJail */
  ij: boolean;
  /** money */
  m: number;
  /** name */
  n: string;
  /** properties */
  p: Square['id'][];
  /** squareId */
  si: Square['id'];
  /** status */
  s: PlayerStatus;
  /** turnsInJail */
  t: number;
};
