import { PlayerStatus } from '../enums';
import { Id } from './id';

export type PlayerMinified = {
  /** color */
  c: string;
  /** id */
  i: Id;
  /** isInJail */
  ij: boolean;
  /** money */
  m: number;
  /** name */
  n: string;
  /** properties */
  p: Id[];
  /** squareId */
  si: Id;
  /** status */
  s: PlayerStatus;
  /** turnsInJail */
  t: number;
};
