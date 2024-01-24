import { PlayerStatus } from '../enums';
import { Id } from './id';

export type Player = {
  color: string;
  id: Id;
  isInJail: boolean;
  money: number;
  name: string;
  properties: Id[];
  squareId: Id;
  status: PlayerStatus;
  turnsInJail: number;
};
