import { GamePhase } from '../enums';
import { Dice } from './dice';
import { GameEvent } from './game-event';
import { Id } from './id';
import { Player } from './player';
import { Square } from './square';

// TODO Merge modals and toasts into notifications. Introduce notification type

export type Game = {
  centerPot: number;
  currentPlayerId: Id;
  dice: Dice;
  events: GameEvent[];
  gamePhase: GamePhase;
  modals: GameEvent[];
  players: Player[];
  squares: Square[];
  toasts: GameEvent[];
};
