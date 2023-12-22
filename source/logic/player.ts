import { Dice, Player, Property } from '../types';

export const canBuy = (player: Player, property: Property): boolean => {
  return player.money >= property.price;
};

export const getsOutOfJail = (player: Player, dice: Dice) => {
  return dice[0] === dice[1] && isPlayerInJail(player);
};

export const isPlayerInJail = (player: Player): boolean => {
  return player.turnsInJail > 0;
};

export const passesGo = (player: Player, nextPosition: number) => {
  return nextPosition < player.position;
};
