import { TurnPhase } from '../enums';
import { GameEvent } from './game-event';
import { Player } from './player';
import { Square } from './square';

export type Game = {
  dice?: number;
  squares: Square[];
  players: Player[];
  currentPlayerId: number;
  events: GameEvent[];
  turnPhase: TurnPhase;
};
