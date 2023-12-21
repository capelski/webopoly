import { SquareType, TaxType } from '../enums';
import { Property } from './property';

export type Square =
  | {
      name: string;
    } & (
      | { type: SquareType.chance }
      | { type: SquareType.communityChest }
      | { type: SquareType.go }
      | { type: SquareType.goToJail }
      | { type: SquareType.jail }
      | { type: SquareType.parking }
      | ({ type: SquareType.property } & Property)
      | { type: SquareType.tax; taxType: TaxType }
    );

export type PositionedSquare = Square & { position: number };
