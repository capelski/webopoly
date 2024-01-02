import { PropertyStatus } from '../enums';
import { Dice, Game, Player, PropertySquare } from '../types';

export const getsOutOfJail = (player: Player, dice: Dice) => {
  return dice[0] === dice[1] && isPlayerInJail(player);
};

export const isPlayerInJail = (player: Player): boolean => {
  return player.turnsInJail > 0;
};

export const passesGo = (game: Game, currentSquareId: number, nextSquareId: number) => {
  const currentIndex = game.squares.findIndex((s) => s.id === currentSquareId);
  const nextIndex = game.squares.findIndex((s) => s.id === nextSquareId);
  return currentIndex > nextIndex;
};

export const paysRent = (player: Player, property: PropertySquare) => {
  return (
    property.ownerId !== undefined &&
    property.ownerId !== player.id &&
    property.status !== PropertyStatus.mortgaged
  );
};
