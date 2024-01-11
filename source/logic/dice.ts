import { Dice } from '../types';

export const getDiceRoll = (): Dice => {
  // return [X, X];
  return [Math.max(1, Math.round(Math.random() * 6)), Math.max(1, Math.round(Math.random() * 6))];
};

export const getDiceMovement = (dice: Dice): number => {
  return dice.reduce((x, y) => x + y, 0);
};
