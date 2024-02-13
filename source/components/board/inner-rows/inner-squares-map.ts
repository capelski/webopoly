import { Id } from '../../../types';

export type InnerSquareMapping = Id[];

export type InnerSquaresMap = {
  bottom: InnerSquareMapping[];
  left: InnerSquareMapping[];
  right: InnerSquareMapping[];
  top: InnerSquareMapping[];
};

export const innerSquaresMap: InnerSquaresMap = {
  top: [[40, 1, 2], [3], [4], [5], [6], [7], [8], [9], [10, 11, 12]],
  right: [[13], [14], [15], [16], [17], [18], [19]],
  bottom: [[20, 21, 22], [23], [24], [25], [26], [27], [28], [29], [30, 31, 32]],
  left: [[33], [34], [35], [36], [37], [38], [39]],
};
