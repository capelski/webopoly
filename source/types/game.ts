import { GamePhase } from '../enums';
import { Dice } from './dice';
import { ExpenseEvent, GetOutOfJailEvent, GEvent, PayRentEvent } from './event';
import { Id } from './id';
import { Player } from './player';
import { Prompt } from './prompt';
import { Square } from './square';

export type Game = {
  centerPot: number;
  currentPlayerId: Id;
  dice: Dice;
  eventHistory: GEvent[];
  nextChanceCardIds: Id[];
  nextCommunityCardIds: Id[];
  notifications: GEvent[];
  pendingEvent: ExpenseEvent | GetOutOfJailEvent | PayRentEvent | undefined;
  players: Player[];
  squares: Square[];
  status: GamePhase | Prompt;
};
