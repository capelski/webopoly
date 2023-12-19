import { Player, Property } from '../types';

export const canBuy = (player: Player, property: Property): boolean => {
  return player.money >= property.price;
};

export const isPlayerInJail = (player: Player): boolean => {
  return player.turnsInJail > 0;
};
