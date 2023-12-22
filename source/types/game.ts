import { GamePhase } from '../enums';
import { Dice } from './dice';
import { GameEvent } from './game-event';
import { Player } from './player';
import { PositionedSquare } from './square';

export type Game = {
  centerPot: number;
  currentPlayerId: number;
  dice: Dice;
  events: GameEvent[];
  gamePhase: GamePhase;
  modals: GameEvent[];
  players: Player[];
  squares: PositionedSquare[];
  toasts: GameEvent[];
};
