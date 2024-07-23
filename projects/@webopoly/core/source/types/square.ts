import { Neighborhood, PropertyStatus, PropertyType, SquareType, TaxType } from '../enums';
import { NumberId } from './id';
import { Player } from './player';

export type SquareBase = {
  id: NumberId;
  name: string;
};

export type GenericSquare = SquareBase & {
  type:
    | SquareType.go
    | SquareType.goToJail
    | SquareType.jail
    | SquareType.parking
    | SquareType.surprise;
};

export type TaxSquare = SquareBase & {
  taxType: TaxType;
  type: SquareType.tax;
};

export type PropertySquareBase = SquareBase & {
  ownerId: Player['id'] | undefined;
  price: number;
  status: PropertyStatus | undefined;
  type: SquareType.property;
};

export type StationSquare = PropertySquareBase & {
  propertyType: PropertyType.station;
};

export type StreetSquare = PropertySquareBase & {
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
