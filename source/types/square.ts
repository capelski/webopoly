import { Neighborhood, PropertyStatus, PropertyType, SquareType, TaxType } from '../enums';
import { Id } from './id';

type SquareBase = {
  id: Id;
  name: string;
};

export type GenericSquare = SquareBase & {
  type:
    | SquareType.chance
    | SquareType.communityChest
    | SquareType.go
    | SquareType.goToJail
    | SquareType.jail
    | SquareType.parking;
};

export type TaxSquare = SquareBase & {
  taxType: TaxType;
  type: SquareType.tax;
};

type PropertySquareBase = SquareBase & {
  ownerId?: Id;
  price: number;
  status?: PropertyStatus;
  type: SquareType.property;
};

export type PropertySquare = PropertySquareBase &
  (
    | {
        propertyType: PropertyType.station | PropertyType.utility;
      }
    | {
        neighborhood: Neighborhood;
        propertyType: PropertyType.street;
      }
  );

export type Square = GenericSquare | TaxSquare | PropertySquare;
