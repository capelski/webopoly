import { Player, Property } from '../types';

export const canBuy = (player: Player, property: Property) => {
  return player.money >= property.price;
};
