import { GameUpdate } from './game-update';
import { Player } from './player';

export type DefaultAction = {
  interval?: number;
  playerId: Player['id'];
  timer?: NodeJS.Timeout;
  update: GameUpdate;
};
