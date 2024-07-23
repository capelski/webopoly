import {
  GenericSquare,
  PropertySquareBase,
  SquareBase,
  StationSquare,
  StreetSquare,
  TaxSquare,
  UtilitySquare,
} from './square';

type SquareBaseMinified = {
  /** id */
  i: SquareBase['id'];
};

export type GenericSquareMinified = SquareBaseMinified & {
  /** type */
  t: GenericSquare['type'];
};

export type TaxSquareMinified = SquareBaseMinified & {
  /** type */
  t: TaxSquare['type'];
};

type PropertySquareBaseMinified = SquareBaseMinified & {
  /** ownerId */
  o: PropertySquareBase['ownerId'];
  /** status */
  s: PropertySquareBase['status'];
  /** type */
  t: PropertySquareBase['type'];
};

export type StationSquareMinified = PropertySquareBaseMinified & {
  /** propertyType */
  pt: StationSquare['propertyType'];
};

export type StreetSquareMinified = PropertySquareBaseMinified & {
  /** houses */
  h: StreetSquare['houses'];
  /** propertyType */
  pt: StreetSquare['propertyType'];
};

export type UtilitySquareMinified = PropertySquareBaseMinified & {
  /** propertyType */
  pt: UtilitySquare['propertyType'];
};

export type PropertySquareMinified =
  | StationSquareMinified
  | StreetSquareMinified
  | UtilitySquareMinified;

export type SquareMinified = GenericSquareMinified | TaxSquareMinified | PropertySquareMinified;
