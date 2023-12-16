import { PropertyType } from '../enums';

export type Property = {
  ownerId?: number;
  price: number;
} & (
  | {
      propertyType: PropertyType.street;
      color: string;
      textColor: string;
    }
  | {
      propertyType: PropertyType.station;
    }
  | {
      propertyType: PropertyType.power;
    }
);
