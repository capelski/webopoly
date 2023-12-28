import { Neighborhood, PropertyStatus, SquareType, TaxType } from '../enums';
import { Id } from './id';

export type SquareBase = { name: string };

export type PropertySquareBase = SquareBase & {
  ownerId?: Id;
  price: number;
  status?: PropertyStatus;
};

export type ChanceSquare = SquareBase & {
  type: SquareType.chance;
};

export type CommunityChestSquare = SquareBase & {
  type: SquareType.communityChest;
};

export type GoSquare = SquareBase & {
  type: SquareType.go;
};

export type GoToJailSquare = SquareBase & {
  type: SquareType.goToJail;
};

export type JailSquare = SquareBase & {
  type: SquareType.jail;
};

export type ParkingSquare = SquareBase & {
  type: SquareType.parking;
};

export type StationSquare = PropertySquareBase & {
  type: SquareType.station;
};

export type StreetSquare = PropertySquareBase & {
  neighborhood: Neighborhood;
  type: SquareType.street;
};

export type TaxSquare = SquareBase & {
  taxType: TaxType;
  type: SquareType.tax;
};

export type UtilitySquare = PropertySquareBase & {
  type: SquareType.utility;
};

export type PropertySquare = StationSquare | StreetSquare | UtilitySquare;

export type SquareUnion =
  | ChanceSquare
  | CommunityChestSquare
  | GoSquare
  | GoToJailSquare
  | JailSquare
  | ParkingSquare
  | TaxSquare
  | PropertySquare;

export type Square = SquareUnion & {
  id: Id;
};
