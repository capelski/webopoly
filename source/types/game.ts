import { TurnPhase } from '../enums';
import { GameEvent } from './game-event';
import { Player } from './player';
import { Square } from './square';

export type Game = {
  squares: Square[];
  players: Player[];
  currentPlayer: number;
  events: GameEvent[];
  turnPhase: TurnPhase;
};
