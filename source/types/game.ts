import { Dice } from './dice';
import { Id } from './id';
import { Notification } from './notification';
import { Player } from './player';
import { Prompt } from './prompt';
import { Square } from './square';

export type Game = {
  centerPot: number;
  currentPlayerId: Id;
  dice: Dice;
  mustRollDice: boolean;
  notifications: Notification[];
  pastNotifications: Notification[];
  players: Player[];
  prompt: Prompt | undefined;
  squares: Square[];
};
