import { PlayerStatus } from '../enums';
import { StringId } from './id';
import { Square } from './square';

export type Player = {
  color: string;
  getOutOfJail: number;
  id: StringId;
  isInJail: boolean;
  money: number;
  name: string;
  properties: Square['id'][];
  squareId: Square['id'];
  status: PlayerStatus;
  turnsInJail: number;
};
