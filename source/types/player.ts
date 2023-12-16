import { PlayerStatus } from '../enums/player-status';

// TODO Introduce playerId

export type Player = {
  color: string;
  id: number;
  money: number;
  name: string;
  position: number;
  properties: string[];
  status: PlayerStatus;
};
