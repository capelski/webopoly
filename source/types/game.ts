import { GamePhase } from '../enums';
import { Dice } from './dice';
import {
  ExpenseNotification,
  GetOutOfJailNotification,
  Notification,
  PayRentNotification,
} from './event';
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
  pendingNotification:
    | ExpenseNotification
    | GetOutOfJailNotification
    | PayRentNotification
    | undefined;
  players: Player[];
  squares: Square[];
  status: GamePhase | Prompt;
};
