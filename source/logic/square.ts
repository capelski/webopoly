import { SquareType } from '../enums';
import { PropertySquare, Square } from '../types';

export const toPropertySquare = (square: Square): PropertySquare | undefined => {
  return square.type === SquareType.station ||
    square.type === SquareType.street ||
    square.type === SquareType.utility
    ? square
    : undefined;
};
