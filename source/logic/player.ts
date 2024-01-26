import { PropertyStatus, SquareType } from '../enums';
import { Game, Player, Square } from '../types';

export const doesPayRent = (player: Player, square: Square): boolean => {
  return (
    square.type === SquareType.property &&
    square.ownerId !== undefined &&
    square.ownerId !== player.id &&
    square.status !== PropertyStatus.mortgaged
  );
};

export const passesGo = (game: Game, currentSquareId: number, nextSquareId: number): boolean => {
  const currentIndex = game.squares.findIndex((s) => s.id === currentSquareId);
  const nextIndex = game.squares.findIndex((s) => s.id === nextSquareId);
  return currentIndex > nextIndex;
};
