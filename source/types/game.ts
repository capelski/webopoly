import { GamePhase } from '../enums';
import { Dice } from './dice';
import { ExpenseEvent, GetOutOfJailEvent, Notification, PayRentEvent } from './event';
import { Id } from './id';
import { Player } from './player';
import { Prompt } from './prompt';
import { Square } from './square';

export type Game = {
  centerPot: number;
  currentPlayerId: Id;
  dice: Dice;
  nextChanceCardIds: Id[];
  nextCommunityCardIds: Id[];
  notifications: Notification[];
  pastNotifications: Notification[];
  pendingNotification: ExpenseEvent | GetOutOfJailEvent | PayRentEvent | undefined;
  players: Player[];
  squares: Square[];
  status: GamePhase | Prompt;
};
