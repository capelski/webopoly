import { Id } from '../../../types';

export type InnerSquaresFrame = { [outerSquareId: Id]: number };

export type InnerSquaresGrid = {
  bottom: InnerSquaresFrame[];
  left: InnerSquaresFrame[];
  right: InnerSquaresFrame[];
  top: InnerSquaresFrame[];
};

export const innerSquares: InnerSquaresGrid = {
  top: [
    {
      40: 90,
      1: 135,
      2: 180,
    },
    { 3: 180 },
    { 4: 180 },
    { 5: 180 },
    { 6: 180 },
    { 7: 180 },
    { 8: 180 },
    { 9: 180 },
    {
      10: 180,
      11: 225,
      12: 270,
    },
  ],
  right: [
    { 13: 270 },
    { 14: 270 },
    { 15: 270 },
    { 16: 270 },
    { 17: 270 },
    { 18: 270 },
    { 19: 270 },
  ],
  bottom: [
    {
      20: 270,
      21: 315,
      22: 0,
    },
    { 23: 0 },
    { 24: 0 },
    { 25: 0 },
    { 26: 0 },
    { 27: 0 },
    { 28: 0 },
    { 29: 0 },
    {
      30: 0,
      31: 45,
      32: 90,
    },
  ],
  left: [{ 33: 90 }, { 34: 90 }, { 35: 90 }, { 36: 90 }, { 37: 90 }, { 38: 90 }, { 39: 90 }],
};
