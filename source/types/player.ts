import { PlayerStatus } from '../enums/player-status';

export type Player = {
  color: string;
  id: number;
  money: number;
  name: string;
  position: number;
  properties: string[];
  status: PlayerStatus;
  turnsInJail: number;
};
