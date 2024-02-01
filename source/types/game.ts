import { Dice } from './dice';
import { GEvent, PendingEvent } from './event';
import { GamePhase } from './game-phase';
import { Id } from './id';
import { Player } from './player';
import { Square } from './square';

export type Game = {
  centerPot: number;
  currentPlayerId: Id;
  dice: Dice;
  eventHistory: GEvent[];
  nextChanceCardIds: Id[];
  nextCommunityCardIds: Id[];
  notifications: GEvent[];
  phase: GamePhase;
  pendingEvent: PendingEvent | undefined;
  players: Player[];
  squares: Square[];
};
