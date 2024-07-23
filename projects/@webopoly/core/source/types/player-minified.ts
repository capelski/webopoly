import { Player } from './player';

export type PlayerMinified = {
  /** color */
  c: Player['color'];
  /** getOutOfJail */
  g: Player['getOutOfJail'];
  /** id */
  i: Player['id'];
  /** isInJail */
  ij: Player['isInJail'];
  /** money */
  m: Player['money'];
  /** name */
  n: Player['name'];
  /** properties */
  p: Player['properties'];
  /** squareId */
  si: Player['squareId'];
  /** status */
  s: Player['status'];
  /** turnsInJail */
  t: Player['turnsInJail'];
};
