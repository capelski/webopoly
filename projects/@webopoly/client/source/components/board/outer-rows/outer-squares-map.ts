import { Square } from '../../../../../core';

export type OuterSquaresMap = {
  bottom: Square['id'][];
  left: Square['id'][];
  right: Square['id'][];
  top: Square['id'][];
};

export const outerSquaresMap: OuterSquaresMap = {
  bottom: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  left: [12, 13, 14, 15, 16, 17, 18, 19, 20],
  top: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
  right: [32, 33, 34, 35, 36, 37, 38, 39, 40],
};
