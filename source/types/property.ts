import { PropertyType } from '../enums';

export type Property = {
  owner?: string;
  price: number;
} & (
  | {
      propertyType: PropertyType.street;
      group: string;
    }
  | {
      propertyType: PropertyType.station;
    }
  | {
      propertyType: PropertyType.power;
    }
);
