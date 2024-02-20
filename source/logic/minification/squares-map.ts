import { Neighborhood, PropertyType, SquareType, TaxType } from '../../enums';
import { Id, Square } from '../../types';

export const squaresMap: { [key: Id]: Square } = {
  1: { id: 1, name: 'Go', type: SquareType.go },
  2: {
    houses: 0,
    id: 2,
    name: 'Old Kent Road',
    neighborhood: Neighborhood.brown,
    ownerId: undefined,
    price: 60,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  3: { id: 3, name: 'Surprise', type: SquareType.surprise },
  4: {
    houses: 0,
    id: 4,
    name: 'Whitechapel Road',
    neighborhood: Neighborhood.brown,
    ownerId: undefined,
    price: 60,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  5: {
    id: 5,
    name: 'Income Tax',
    taxType: TaxType.income,
    type: SquareType.tax,
  },
  6: {
    id: 6,
    name: "King's Cross Station",
    ownerId: undefined,
    price: 200,
    propertyType: PropertyType.station,
    status: undefined,
    type: SquareType.property,
  },
  7: {
    houses: 0,
    id: 7,
    name: 'The Angel Islington',
    neighborhood: Neighborhood.lightblue,
    ownerId: undefined,
    price: 100,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  8: { id: 8, name: 'Surprise', type: SquareType.surprise },
  9: {
    houses: 0,
    id: 9,
    name: 'Euston Road',
    neighborhood: Neighborhood.lightblue,
    ownerId: undefined,
    price: 100,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  10: {
    houses: 0,
    id: 10,
    name: 'Pentonville Road',
    neighborhood: Neighborhood.lightblue,
    ownerId: undefined,
    price: 120,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  11: { id: 11, name: 'Jail', type: SquareType.jail },
  12: {
    houses: 0,
    id: 12,
    name: 'Pall Mall',
    neighborhood: Neighborhood.pink,
    ownerId: undefined,
    price: 140,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  13: {
    icon: '🔌',
    id: 13,
    name: 'Electric Company',
    ownerId: undefined,
    price: 150,
    propertyType: PropertyType.utility,
    status: undefined,
    type: SquareType.property,
  },
  14: {
    houses: 0,
    id: 14,
    name: 'Whitehall',
    neighborhood: Neighborhood.pink,
    ownerId: undefined,
    price: 140,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  15: {
    houses: 0,
    id: 15,
    name: 'Northumberland Av.',
    neighborhood: Neighborhood.pink,
    ownerId: undefined,
    price: 160,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  16: {
    id: 16,
    name: 'Marylebone Station',
    ownerId: undefined,
    price: 200,
    propertyType: PropertyType.station,
    status: undefined,
    type: SquareType.property,
  },
  17: {
    houses: 0,
    id: 17,
    name: 'Bow Street',
    neighborhood: Neighborhood.orange,
    ownerId: undefined,
    price: 180,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  18: { id: 18, name: 'Surprise', type: SquareType.surprise },
  19: {
    houses: 0,
    id: 19,
    name: 'Marlborough Street',
    neighborhood: Neighborhood.orange,
    ownerId: undefined,
    price: 180,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  20: {
    houses: 0,
    id: 20,
    name: 'Vine Street',
    neighborhood: Neighborhood.orange,
    ownerId: undefined,
    price: 200,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  21: { id: 21, name: 'Free Parking', type: SquareType.parking },
  22: {
    houses: 0,
    id: 22,
    name: 'Strand',
    neighborhood: Neighborhood.red,
    ownerId: undefined,
    price: 220,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  23: { id: 23, name: 'Surprise', type: SquareType.surprise },
  24: {
    houses: 0,
    id: 24,
    name: 'Fleet Street',
    neighborhood: Neighborhood.red,
    ownerId: undefined,
    price: 220,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  25: {
    houses: 0,
    id: 25,
    name: 'Trafalgar Square',
    neighborhood: Neighborhood.red,
    ownerId: undefined,
    price: 240,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  26: {
    id: 26,
    name: 'Fenchurch St. Station',
    ownerId: undefined,
    price: 200,
    propertyType: PropertyType.station,
    status: undefined,
    type: SquareType.property,
  },
  27: {
    houses: 0,
    id: 27,
    name: 'Leicester Square',
    neighborhood: Neighborhood.yellow,
    ownerId: undefined,
    price: 260,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  28: {
    houses: 0,
    id: 28,
    name: 'Coventry Street',
    neighborhood: Neighborhood.yellow,
    ownerId: undefined,
    price: 260,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  29: {
    icon: '💧',
    id: 29,
    name: 'Water Works',
    ownerId: undefined,
    price: 150,
    propertyType: PropertyType.utility,
    status: undefined,
    type: SquareType.property,
  },
  30: {
    houses: 0,
    id: 30,
    name: 'Piccadilly',
    neighborhood: Neighborhood.yellow,
    ownerId: undefined,
    price: 280,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  31: { id: 31, name: 'Go To Jail', type: SquareType.goToJail },
  32: {
    houses: 0,
    id: 32,
    name: 'Regent Street',
    neighborhood: Neighborhood.green,
    ownerId: undefined,
    price: 300,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  33: {
    houses: 0,
    id: 33,
    name: 'Oxford Street',
    neighborhood: Neighborhood.green,
    ownerId: undefined,
    price: 300,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  34: { id: 34, name: 'Surprise', type: SquareType.surprise },
  35: {
    houses: 0,
    id: 35,
    name: 'Bond Street',
    neighborhood: Neighborhood.green,
    ownerId: undefined,
    price: 320,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  36: {
    id: 36,
    name: 'Liverpool St. Station',
    ownerId: undefined,
    price: 200,
    propertyType: PropertyType.station,
    status: undefined,
    type: SquareType.property,
  },
  37: { id: 37, name: 'Surprise', type: SquareType.surprise },
  38: {
    houses: 0,
    id: 38,
    name: 'Park Lane',
    neighborhood: Neighborhood.darkblue,
    ownerId: undefined,
    price: 350,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
  39: {
    id: 39,
    name: 'Luxury Tax',
    taxType: TaxType.luxury,
    type: SquareType.tax,
  },
  40: {
    houses: 0,
    id: 40,
    name: 'Mayfair',
    neighborhood: Neighborhood.darkblue,
    ownerId: undefined,
    price: 400,
    propertyType: PropertyType.street,
    status: undefined,
    type: SquareType.property,
  },
};
