import { GamePhase, Neighborhood, SquareType, TaxType } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { playerInitialMoney } from '../parameters';
import { SquareUnion } from '../types';
import { Game } from '../types/game';

const squares: SquareUnion[] = [
  { name: 'Go', type: SquareType.go },
  {
    name: 'Old Kent Rd.',
    type: SquareType.street,
    neighborhood: Neighborhood.brown,
    price: 60,
  },
  { name: 'Community chest', type: SquareType.communityChest },
  {
    name: 'Whitechapel Rd.',
    type: SquareType.street,
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
    type: SquareType.station,
    price: 200,
  },
  {
    name: 'Angel Islington',
    type: SquareType.street,
    neighborhood: Neighborhood.lightblue,
    price: 100,
  },
  { name: 'Chance', type: SquareType.chance },
  {
    name: 'Euston Rd.',
    type: SquareType.street,
    neighborhood: Neighborhood.lightblue,
    price: 100,
  },
  {
    name: 'Pentonville Rd.',
    type: SquareType.street,
    neighborhood: Neighborhood.lightblue,
    price: 120,
  },
  { name: 'Jail', type: SquareType.jail },
  {
    name: 'Pall Mall',
    type: SquareType.street,
    neighborhood: Neighborhood.pink,
    price: 140,
  },
  {
    name: 'Electric Co.',
    type: SquareType.utility,
    price: 150,
  },
  {
    name: 'Whitehall',
    type: SquareType.street,
    neighborhood: Neighborhood.pink,
    price: 140,
  },
  {
    name: 'Northumberland',
    type: SquareType.street,
    neighborhood: Neighborhood.pink,
    price: 160,
  },
  {
    name: 'Marylebone',
    type: SquareType.station,
    price: 200,
  },
  {
    name: 'Bow St.',
    type: SquareType.street,
    neighborhood: Neighborhood.orange,
    price: 180,
  },
  { name: 'Community chest', type: SquareType.communityChest },
  {
    name: 'Marlborough St.',
    type: SquareType.street,
    neighborhood: Neighborhood.orange,
    price: 180,
  },
  {
    name: 'Vine St.',
    type: SquareType.street,
    neighborhood: Neighborhood.orange,
    price: 200,
  },
  { name: 'Free Parking', type: SquareType.parking },
  {
    name: 'Strand',
    type: SquareType.street,
    neighborhood: Neighborhood.red,
    price: 220,
  },
  { name: 'Chance', type: SquareType.chance },
  {
    name: 'Fleet St.',
    type: SquareType.street,
    neighborhood: Neighborhood.red,
    price: 220,
  },
  {
    name: 'Trafalgar Square',
    type: SquareType.street,
    neighborhood: Neighborhood.red,
    price: 240,
  },
  {
    name: 'Fenchurch St.',
    type: SquareType.station,
    price: 200,
  },
  {
    name: 'Leicester Square',
    type: SquareType.street,
    neighborhood: Neighborhood.yellow,
    price: 260,
  },
  {
    name: 'Coventry St.',
    type: SquareType.street,
    neighborhood: Neighborhood.yellow,
    price: 260,
  },
  {
    name: 'Water Works',
    type: SquareType.utility,
    price: 150,
  },
  {
    name: 'Piccadilly',
    type: SquareType.street,
    neighborhood: Neighborhood.yellow,
    price: 280,
  },
  { name: 'Go To Jail', type: SquareType.goToJail },
  {
    name: 'Regent St.',
    type: SquareType.street,
    neighborhood: Neighborhood.green,
    price: 300,
  },
  {
    name: 'Oxford St.',
    type: SquareType.street,
    neighborhood: Neighborhood.green,
    price: 300,
  },
  { name: 'Community chest', type: SquareType.communityChest },
  {
    name: 'Bond St.',
    type: SquareType.street,
    neighborhood: Neighborhood.green,
    price: 320,
  },
  {
    name: 'Liverpool St.',
    type: SquareType.station,
    price: 200,
  },
  { name: 'Chance', type: SquareType.chance },
  {
    name: 'Park Lane',
    type: SquareType.street,
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
    type: SquareType.street,
    neighborhood: Neighborhood.darkblue,
    price: 400,
  },
];

export const createGame = (nPlayers: number): Game => {
  return {
    centerPot: 0,
    currentPlayerId: 0,
    dice: [],
    events: [],
    gamePhase: GamePhase.rollDice,
    modals: [],
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
    toasts: [],
  };
};
