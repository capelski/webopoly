import { PropertyStatus, PropertyType, SquareType } from '../enums';
import { Id } from './id';

type SquareBaseMinified = {
  /** id */
  i: Id;
};

export type GenericSquareMinified = SquareBaseMinified & {
  /** type */
  t:
    | SquareType.go
    | SquareType.goToJail
    | SquareType.jail
    | SquareType.parking
    | SquareType.surprise;
};

export type TaxSquareMinified = SquareBaseMinified & {
  /** type */
  t: SquareType.tax;
};

type PropertySquareBaseMinified = SquareBaseMinified & {
  /** ownerId */
  o: Id | undefined;
  /** status */
  s: PropertyStatus | undefined;
  /** type */
  t: SquareType.property;
};

export type StationSquareMinified = PropertySquareBaseMinified & {
  /** propertyType */
  pt: PropertyType.station;
};

export type StreetSquareMinified = PropertySquareBaseMinified & {
  /** houses */
  h: number;
  /** propertyType */
  pt: PropertyType.street;
};

export type UtilitySquareMinified = PropertySquareBaseMinified & {
  /** propertyType */
  pt: PropertyType.utility;
};

export type PropertySquareMinified =
  | StationSquareMinified
  | StreetSquareMinified
  | UtilitySquareMinified;

export type SquareMinified = GenericSquareMinified | TaxSquareMinified | PropertySquareMinified;
