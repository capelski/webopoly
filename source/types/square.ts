import { Neighborhood, SquareType, TaxType } from '../enums';
import { Id } from './id';

export type SquareBase = { name: string };

export type PropertySquare = SquareBase & {
  ownerId?: Id;
  price: number;
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

export type StationSquare = PropertySquare & {
  type: SquareType.station;
};

export type StreetSquare = PropertySquare & {
  neighborhood: Neighborhood;
  type: SquareType.street;
};

export type TaxSquare = SquareBase & {
  taxType: TaxType;
  type: SquareType.tax;
};

export type UtilitySquare = PropertySquare & {
  type: SquareType.utility;
};

export type SquareUnion =
  | ChanceSquare
  | CommunityChestSquare
  | GoSquare
  | GoToJailSquare
  | JailSquare
  | ParkingSquare
  | StationSquare
  | StreetSquare
  | TaxSquare
  | UtilitySquare;

export type Square = SquareUnion & {
  id: Id;
};
