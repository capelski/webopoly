import { GamePhase } from '../enums';
import { Dice } from './dice';
import { GameEvent } from './game-event';
import { Player } from './player';
import { PositionedSquare } from './square';

export type Game = {
  dice: Dice;
  squares: PositionedSquare[];
  players: Player[];
  currentPlayerId: number;
  notifications: GameEvent[];
  events: GameEvent[];
  gamePhase: GamePhase;
  centerPot: number;
};
