import { SquareType, TaxType } from '../enums';
import { Property } from './property';

// TODO Create SquareTypes in the same fashion as events
// TODO Move position to Square. Use partial to omit it in population

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
