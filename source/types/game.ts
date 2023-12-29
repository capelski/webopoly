import { GamePhase } from '../enums';
import { Dice } from './dice';
import { EventNotification } from './event-notification';
import { GameEvent } from './game-event';
import { Id } from './id';
import { Player } from './player';
import { Square } from './square';

export type Game = {
  centerPot: number;
  currentPlayerId: Id;
  dice: Dice;
  events: GameEvent[];
  gamePhase: GamePhase;
  notifications: EventNotification[];
  players: Player[];
  squares: Square[];
};
