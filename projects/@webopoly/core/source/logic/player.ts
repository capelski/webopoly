import { maxDoublesInARow } from '../constants';
import { PropertyStatus, PropertyType, SquareType } from '../enums';
import {
  Game,
  Player,
  PropertySquare,
  Square,
  StationSquare,
  StreetSquare,
  UtilitySquare,
} from '../types';
import { getPlayerById } from './game';

export const doesPayRent = (playerId: Player['id'], square: Square): boolean => {
  return (
    square.type === SquareType.property &&
    square.ownerId !== undefined &&
    square.ownerId !== playerId &&
    square.status !== PropertyStatus.mortgaged
  );
};

export const exceedsMaxDoublesInARow = (doublesInARow: number) =>
  doublesInARow === maxDoublesInARow;

export const hasExtraTurn = (player: Player) =>
  player.doublesInARow > 0 && !exceedsMaxDoublesInARow(player.doublesInARow);

export const hasEnoughMoney = (player: Player, amount: number) => {
  return player.money >= amount;
};

export const getNeighborhoodStreets = (squares: Square[], street: StreetSquare): StreetSquare[] => {
  return squares.filter(
    (p) =>
      p.type === SquareType.property &&
      p.propertyType === PropertyType.street &&
      p.neighborhood === street.neighborhood,
  ) as StreetSquare[];
};

const getPlayerActiveProperties = (game: Game<any>, playerId: Player['id']) => {
  const landlord = getPlayerById(game, playerId);
  const properties = (
    landlord.properties.map(
      (propertyId) => game.squares.find((s) => s.id === propertyId)!,
    ) as PropertySquare[]
  ).filter((p) => p.status !== PropertyStatus.mortgaged);

  return properties;
};

export const getPlayerActiveStations = (game: Game<any>, playerId: Player['id']) => {
  const properties = getPlayerActiveProperties(game, playerId);
  const stations = properties.filter(
    (p) => p.type === SquareType.property && p.propertyType === PropertyType.station,
  ) as StationSquare[];

  return stations;
};

export const getPlayerActiveUtilities = (game: Game<any>, playerId: Player['id']) => {
  const properties = getPlayerActiveProperties(game, playerId);
  const utilities = properties.filter(
    (p) => p.type === SquareType.property && p.propertyType === PropertyType.utility,
  ) as UtilitySquare[];

  return utilities;
};

export const ownsNeighborhood = (game: Game<any>, street: StreetSquare) => {
  const neighborhoodStreets = getNeighborhoodStreets(game.squares, street);
  const ownedStreets = neighborhoodStreets.filter(
    (p) => p.ownerId === street.ownerId && p.status !== PropertyStatus.mortgaged,
  );
  return ownedStreets.length === neighborhoodStreets.length;
};

export const passesGo = (
  game: Game<any>,
  currentSquareId: number,
  nextSquareId: number,
): boolean => {
  const currentIndex = game.squares.findIndex((s) => s.id === currentSquareId);
  const nextIndex = game.squares.findIndex((s) => s.id === nextSquareId);
  return currentIndex > nextIndex;
};
