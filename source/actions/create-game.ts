import { GamePhase, Neighborhood, SquareType, TaxType } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { playerInitialMoney } from '../parameters';
import { Player, Square, SquareUnion } from '../types';
import { Game } from '../types/game';

const squaresSource: SquareUnion[] = [
  { name: 'Go', type: SquareType.go },
  {
    name: 'Old Kent Rd.',
    neighborhood: Neighborhood.brown,
    price: 60,
    type: SquareType.street,
  },
  { name: 'Community chest', type: SquareType.communityChest },
  {
    name: 'Whitechapel Rd.',
    neighborhood: Neighborhood.brown,
    price: 60,
    type: SquareType.street,
  },
  {
    name: 'Income Tax',
    taxType: TaxType.income,
    type: SquareType.tax,
  },
  {
    name: 'Kings Cross',
    price: 200,
    type: SquareType.station,
  },
  {
    name: 'Angel Islington',
    neighborhood: Neighborhood.lightblue,
    price: 100,
    type: SquareType.street,
  },
  { name: 'Chance', type: SquareType.chance },
  {
    name: 'Euston Rd.',
    neighborhood: Neighborhood.lightblue,
    price: 100,
    type: SquareType.street,
  },
  {
    name: 'Pentonville Rd.',
    neighborhood: Neighborhood.lightblue,
    price: 120,
    type: SquareType.street,
  },
  { name: 'Jail', type: SquareType.jail },
  {
    name: 'Pall Mall',
    neighborhood: Neighborhood.pink,
    price: 140,
    type: SquareType.street,
  },
  {
    name: 'Electric Co.',
    type: SquareType.utility,
    price: 150,
  },
  {
    name: 'Whitehall',
    neighborhood: Neighborhood.pink,
    price: 140,
    type: SquareType.street,
  },
  {
    name: 'Northumberland',
    neighborhood: Neighborhood.pink,
    price: 160,
    type: SquareType.street,
  },
  {
    name: 'Marylebone',
    type: SquareType.station,
    price: 200,
  },
  {
    name: 'Bow St.',
    neighborhood: Neighborhood.orange,
    price: 180,
    type: SquareType.street,
  },
  { name: 'Community chest', type: SquareType.communityChest },
  {
    name: 'Marlborough St.',
    neighborhood: Neighborhood.orange,
    price: 180,
    type: SquareType.street,
  },
  {
    name: 'Vine St.',
    neighborhood: Neighborhood.orange,
    price: 200,
    type: SquareType.street,
  },
  { name: 'Free Parking', type: SquareType.parking },
  {
    name: 'Strand',
    neighborhood: Neighborhood.red,
    price: 220,
    type: SquareType.street,
  },
  { name: 'Chance', type: SquareType.chance },
  {
    name: 'Fleet St.',
    neighborhood: Neighborhood.red,
    price: 220,
    type: SquareType.street,
  },
  {
    name: 'Trafalgar Square',
    neighborhood: Neighborhood.red,
    price: 240,
    type: SquareType.street,
  },
  {
    name: 'Fenchurch St.',
    type: SquareType.station,
    price: 200,
  },
  {
    name: 'Leicester Square',
    neighborhood: Neighborhood.yellow,
    price: 260,
    type: SquareType.street,
  },
  {
    name: 'Coventry St.',
    neighborhood: Neighborhood.yellow,
    price: 260,
    type: SquareType.street,
  },
  {
    name: 'Water Works',
    type: SquareType.utility,
    price: 150,
  },
  {
    name: 'Piccadilly',
    neighborhood: Neighborhood.yellow,
    price: 280,
    type: SquareType.street,
  },
  { name: 'Go To Jail', type: SquareType.goToJail },
  {
    name: 'Regent St.',
    neighborhood: Neighborhood.green,
    price: 300,
    type: SquareType.street,
  },
  {
    name: 'Oxford St.',
    neighborhood: Neighborhood.green,
    price: 300,
    type: SquareType.street,
  },
  { name: 'Community chest', type: SquareType.communityChest },
  {
    name: 'Bond St.',
    neighborhood: Neighborhood.green,
    price: 320,
    type: SquareType.street,
  },
  {
    name: 'Liverpool St.',
    type: SquareType.station,
    price: 200,
  },
  { name: 'Chance', type: SquareType.chance },
  {
    name: 'Park Lane',
    neighborhood: Neighborhood.darkblue,
    price: 350,
    type: SquareType.street,
  },
  {
    name: 'Luxury Tax',
    taxType: TaxType.luxury,
    type: SquareType.tax,
  },
  {
    name: 'Mayfair',
    neighborhood: Neighborhood.darkblue,
    price: 400,
    type: SquareType.street,
  },
];

export const createGame = (nPlayers: number): Game => {
  const squares = squaresSource.map<Square>((s, index) => ({ ...s, id: index + 1 }));

  const players = [...Array(nPlayers)].map<Player>((_, index) => ({
    color: '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0'),
    id: index + 1,
    money: playerInitialMoney,
    name: `Player ${index + 1}`,
    properties: [],
    squareId: squares[0].id,
    status: PlayerStatus.playing,
    turnsInJail: 0,
  }));

  return {
    centerPot: 0,
    currentPlayerId: players[0].id,
    dice: [],
    events: [],
    gamePhase: GamePhase.rollDice,
    modals: [],
    players,
    squares,
    toasts: [],
  };
};
