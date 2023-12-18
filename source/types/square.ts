import { SquareType } from '../enums';
import { Property } from './property';

export type Square =
  | {
      name: string;
    } & (
      | { type: SquareType.chest }
      | { type: SquareType.go }
      | { type: SquareType.goToJail }
      | { type: SquareType.jail }
      | { type: SquareType.parking }
      | ({ type: SquareType.property } & Property)
      | { type: SquareType.tax }
    );

export type PositionedSquare = Square & { position: number };
