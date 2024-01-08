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
  ownerId: Id | undefined;
  price: number;
  status: PropertyStatus | undefined;
  type: SquareType.property;
};

export type StationSquare = PropertySquareBase & {
  propertyType: PropertyType.station;
};

export type StreetSquare = PropertySquareBase & {
  housePrice: number;
  houses: number;
  neighborhood: Neighborhood;
  propertyType: PropertyType.street;
};

export type UtilitySquare = PropertySquareBase & {
  icon: string;
  propertyType: PropertyType.utility;
};

export type PropertySquare = StationSquare | StreetSquare | UtilitySquare;

export type Square = GenericSquare | TaxSquare | PropertySquare;
