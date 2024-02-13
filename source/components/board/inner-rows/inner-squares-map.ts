import { Id } from '../../../types';

export type InnerSquareData = {
  innerSquareId: Id;
  outerSquareIds: Id[];
};

export type InnerSquaresMap = {
  bottom: InnerSquareData[];
  left: InnerSquareData[];
  right: InnerSquareData[];
  top: InnerSquareData[];
};

export const innerSquaresMap: InnerSquaresMap = {
  bottom: [
    { innerSquareId: 1, outerSquareIds: [40, 1, 2] },
    { innerSquareId: 2, outerSquareIds: [3] },
    { innerSquareId: 3, outerSquareIds: [4] },
    { innerSquareId: 4, outerSquareIds: [5] },
    { innerSquareId: 5, outerSquareIds: [6] },
    { innerSquareId: 6, outerSquareIds: [7] },
    { innerSquareId: 7, outerSquareIds: [8] },
    { innerSquareId: 8, outerSquareIds: [9] },
    { innerSquareId: 9, outerSquareIds: [10, 11, 12] },
  ],
  left: [
    { innerSquareId: 10, outerSquareIds: [13] },
    { innerSquareId: 11, outerSquareIds: [14] },
    { innerSquareId: 12, outerSquareIds: [15] },
    { innerSquareId: 13, outerSquareIds: [16] },
    { innerSquareId: 14, outerSquareIds: [17] },
    { innerSquareId: 15, outerSquareIds: [18] },
    { innerSquareId: 16, outerSquareIds: [19] },
  ],
  top: [
    { innerSquareId: 17, outerSquareIds: [20, 21, 22] },
    { innerSquareId: 18, outerSquareIds: [23] },
    { innerSquareId: 19, outerSquareIds: [24] },
    { innerSquareId: 20, outerSquareIds: [25] },
    { innerSquareId: 21, outerSquareIds: [26] },
    { innerSquareId: 22, outerSquareIds: [27] },
    { innerSquareId: 23, outerSquareIds: [28] },
    { innerSquareId: 24, outerSquareIds: [29] },
    { innerSquareId: 25, outerSquareIds: [30, 31, 32] },
  ],
  right: [
    { innerSquareId: 26, outerSquareIds: [33] },
    { innerSquareId: 27, outerSquareIds: [34] },
    { innerSquareId: 28, outerSquareIds: [35] },
    { innerSquareId: 29, outerSquareIds: [36] },
    { innerSquareId: 30, outerSquareIds: [37] },
    { innerSquareId: 31, outerSquareIds: [38] },
    { innerSquareId: 32, outerSquareIds: [39] },
  ],
};
