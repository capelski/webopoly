import { LiquidationReason, PropertyStatus, PropertyType, SquareType } from '../enums';
import {
  clearMortgageRate,
  houseBuildPercentage,
  houseRents,
  houseSellPercentage,
  housesMax,
  mortgagePercentage,
  rentPercentage,
  stationRents,
} from '../parameters';
import {
  Game,
  GameLiquidationPhase,
  GamePlayPhase,
  GameRollDicePhase,
  Id,
  Player,
  PropertySquare,
  Square,
  StreetSquare,
} from '../types';
import { getDiceMovement } from './dice';
import { getPlayerById } from './game';

export const canBuildHouse = (
  game: GamePlayPhase | GameRollDicePhase,
  property: StreetSquare,
  player: Player,
): boolean => {
  const neighborhoodStreets = getNeighborhoodStreets(game.squares, property);
  const allOwned = neighborhoodStreets.every((p) => p.ownerId === player.id);
  const minHousesNumber = neighborhoodStreets.reduce(
    (reduced, p) => Math.min(reduced, p.houses),
    housesMax,
  );

  const balancedHousesNumber = property.houses <= minHousesNumber;

  return (
    property.status !== PropertyStatus.mortgaged &&
    allOwned &&
    property.houses < housesMax &&
    balancedHousesNumber &&
    player.money >= getBuildHouseAmount(property)
  );
};

export const canClearMortgage = (property: PropertySquare, player: Player): boolean => {
  return (
    property.ownerId === player.id &&
    property.status === PropertyStatus.mortgaged &&
    player.money >= getClearMortgageAmount(property)
  );
};

export const canMortgage = (property: PropertySquare, playerId: Id): boolean => {
  return (
    property.ownerId === playerId &&
    property.status !== PropertyStatus.mortgaged &&
    (property.propertyType !== PropertyType.street || property.houses === 0)
  );
};

export const canSellHouse = (
  game: GamePlayPhase | GameRollDicePhase | GameLiquidationPhase<LiquidationReason>,
  property: StreetSquare,
  player: Player,
): boolean => {
  const neighborhoodStreets = getNeighborhoodStreets(game.squares, property);
  const maxHousesNumber = neighborhoodStreets.reduce(
    (reduced, p) => Math.max(reduced, p.houses),
    0,
  );
  const balancedHousesNumber = property.houses >= maxHousesNumber;

  return property.ownerId === player.id && property.houses > 0 && balancedHousesNumber;
};

export const getBuildHouseAmount = (property: StreetSquare) => {
  return Math.round((property.price / 5) * houseBuildPercentage) * 5;
};

export const getClearMortgageAmount = (property: PropertySquare) => {
  return Math.round(mortgagePercentage * property.price * clearMortgageRate);
};

const getNeighborhoodStreets = (squares: Square[], property: StreetSquare): StreetSquare[] => {
  return squares.filter(
    (p) =>
      p.type === SquareType.property &&
      p.propertyType === PropertyType.street &&
      p.neighborhood === property.neighborhood,
  ) as StreetSquare[];
};

export const getMortgageAmount = (property: PropertySquare) => {
  return Math.round(mortgagePercentage * property.price);
};

export const getRentAmount = (game: Game, property: PropertySquare) => {
  const landlord = getPlayerById(game, property.ownerId!);
  const properties = (
    landlord.properties.map(
      (propertyId) => game.squares.find((s) => s.id === propertyId)!,
    ) as PropertySquare[]
  ).filter((p) => p.status !== PropertyStatus.mortgaged);

  let rent = 0;

  if (property.propertyType === PropertyType.station) {
    const stations = properties.filter(
      (p) => p.type === SquareType.property && p.propertyType === PropertyType.station,
    );
    rent = stationRents[stations.length];
  } else if (property.propertyType === PropertyType.street) {
    if (property.houses > 0) {
      rent = houseRents[property.houses] * property.price;
    } else {
      const neighborhoodStreets = getNeighborhoodStreets(game.squares, property);
      const ownedStreets = neighborhoodStreets.filter(
        (p) => p.ownerId === landlord.id && p.status !== PropertyStatus.mortgaged,
      );

      rent =
        property.price *
        rentPercentage *
        (ownedStreets.length === neighborhoodStreets.length ? 2 : 1);
    }
  } else {
    const utilityProperties = properties.filter(
      (p) => p.type === SquareType.property && p.propertyType === PropertyType.utility,
    );
    const movement = getDiceMovement(game.dice);
    rent = movement * (utilityProperties.length === 2 ? 10 : 4);
  }

  return Math.round(rent);
};

export const getSellHouseAmount = (property: StreetSquare) => {
  return Math.round((property.price / 5) * houseSellPercentage) * 5;
};
