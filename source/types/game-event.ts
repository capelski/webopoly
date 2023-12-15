import { GameEventType } from '../enums';

export type GameEvent = {
  description: string;
  type: GameEventType;
};
