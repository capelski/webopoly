import { TurnPhase } from '../enums';
import { GameEvent } from './game-event';
import { Player } from './player';
import { PositionedSquare } from './square';

export type Game = {
  dice?: number;
  squares: PositionedSquare[];
  players: Player[];
  currentPlayerId: number;
  events: GameEvent[];
  turnPhase: TurnPhase;
};
