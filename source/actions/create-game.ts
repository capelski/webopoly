import { Neighborhood, PropertyType, SquareType, TaxType, TurnPhase } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { playerInitialMoney } from '../parameters';
import { Square } from '../types';
import { Game } from '../types/game';

export const createGame = (nPlayers: number): Game => {
  const squares: Square[] = [
    { name: 'Go', type: SquareType.go },
    {
      name: 'Old Kent Rd.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.brown,
      price: 60,
    },
    { name: 'Chest', type: SquareType.chest },
    {
      name: 'Whitechapel Rd.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.brown,
      price: 60,
    },
    {
      name: 'Income Tax',
      taxType: TaxType.income,
      type: SquareType.tax,
    },
    {
      name: 'Kings Cross',
      type: SquareType.property,
      propertyType: PropertyType.station,
      price: 200,
    },
    {
      name: 'Angel Islington',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.lightblue,
      price: 100,
    },
    { name: 'Chest', type: SquareType.chest },
    {
      name: 'Euston Rd.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.lightblue,
      price: 100,
    },
    {
      name: 'Pentonville Rd.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.lightblue,
      price: 120,
    },
    { name: 'Jail', type: SquareType.jail },
    {
      name: 'Pall Mall',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.pink,
      price: 140,
    },
    {
      name: 'Electric Co.',
      type: SquareType.property,
      propertyType: PropertyType.power,
      price: 150,
    },
    {
      name: 'Whitehall',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.pink,
      price: 140,
    },
    {
      name: 'Northumberland',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.pink,
      price: 160,
    },
    {
      name: 'Marylebone',
      type: SquareType.property,
      propertyType: PropertyType.station,
      price: 200,
    },
    {
      name: 'Bow St.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.orange,
      price: 180,
    },
    { name: 'Chest', type: SquareType.chest },
    {
      name: 'Marlborough St.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.orange,
      price: 180,
    },
    {
      name: 'Vine St.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.orange,
      price: 200,
    },
    { name: 'Free Parking', type: SquareType.parking },
    {
      name: 'Strand',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.red,
      price: 220,
    },
    { name: 'Chest', type: SquareType.chest },
    {
      name: 'Fleet St.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.red,
      price: 220,
    },
    {
      name: 'Trafalgar Square',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.red,
      price: 240,
    },
    {
      name: 'Fenchurch St.',
      type: SquareType.property,
      propertyType: PropertyType.station,
      price: 200,
    },
    {
      name: 'Leicester Square',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.yellow,
      price: 260,
    },
    {
      name: 'Coventry St.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.yellow,
      price: 260,
    },
    {
      name: 'Water Works',
      type: SquareType.property,
      propertyType: PropertyType.power,
      price: 150,
    },
    {
      name: 'Piccadilly',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.yellow,
      price: 280,
    },
    { name: 'Go To Jail', type: SquareType.goToJail },
    {
      name: 'Regent St.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.green,
      price: 300,
    },
    {
      name: 'Oxford St.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.green,
      price: 300,
    },
    { name: 'Chest', type: SquareType.chest },
    {
      name: 'Bond St.',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.green,
      price: 320,
    },
    {
      name: 'Liverpool St.',
      type: SquareType.property,
      propertyType: PropertyType.station,
      price: 200,
    },
    { name: 'Chest', type: SquareType.chest },
    {
      name: 'Park Lane',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.darkblue,
      price: 350,
    },
    {
      name: 'Luxury Tax',
      taxType: TaxType.luxury,
      type: SquareType.tax,
    },
    {
      name: 'Mayfair',
      type: SquareType.property,
      propertyType: PropertyType.street,
      neighborhood: Neighborhood.darkblue,
      price: 400,
    },
  ];

  return {
    currentPlayerId: 0,
    dice: [],
    players: [...Array(nPlayers)].map((_, index) => ({
      color: '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'),
      id: index,
      money: playerInitialMoney,
      name: `Player ${index + 1}`,
      position: 0,
      properties: [],
      status: PlayerStatus.playing,
      turnsInJail: 0,
    })),
    squares: squares.map((s, index) => ({ ...s, position: index })),
    events: [],
    turnPhase: TurnPhase.start,
    centerPot: 0,
  };
};
