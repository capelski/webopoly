import { Neighborhood, PropertyType } from '../enums';

export type Property = {
  ownerId?: number;
  price: number;
} & (
  | {
      propertyType: PropertyType.street;
      neighborhood: Neighborhood;
    }
  | {
      propertyType: PropertyType.station;
    }
  | {
      propertyType: PropertyType.power;
    }
);
