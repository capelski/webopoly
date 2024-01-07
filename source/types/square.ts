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
        propertyType: PropertyType.station;
      }
    | {
        housePrice: number;
        houses?: number;
        neighborhood: Neighborhood;
        propertyType: PropertyType.street;
      }
    | {
        icon: string;
        propertyType: PropertyType.utility;
      }
  );

export type Square = GenericSquare | TaxSquare | PropertySquare;

export type SquareMinified = {
  /** id */
  i: Id;
  /** houses */
  h?: number;
  /** ownerId */
  o?: Id;
  /** status */
  s?: PropertyStatus;
};
