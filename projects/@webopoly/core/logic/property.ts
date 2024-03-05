import {
  clearMortgageRate,
  houseBuildPercentage,
  houseRents,
  houseSellPercentage,
  housesMax,
  mortgagePercentage,
  rentPercentage,
  stationRents,
} from '../constants';
import { LiquidationReason, PropertyStatus, PropertyType } from '../enums';
import {
  Game,
  GameLiquidationPhase,
  GamePlayPhase,
  GameRollDicePhase,
  Player,
  PropertySquare,
  StreetSquare,
} from '../types';
import { getDiceMovement } from './dice';
import { getPlayerById } from './game';
import {
  getNeighborhoodStreets,
  getPlayerActiveStations,
  getPlayerActiveUtilities,
  ownsNeighborhood,
} from './player';

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

export const canMortgage = (property: PropertySquare, playerId: Player['id']): boolean => {
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
  return Math.round(property.price * houseBuildPercentage);
};

export const getClearMortgageAmount = (property: PropertySquare) => {
  return Math.round(mortgagePercentage * property.price * clearMortgageRate);
};

export const getMortgageAmount = (property: PropertySquare) => {
  return Math.round(mortgagePercentage * property.price);
};

export const getRentAmount = (game: Game, property: PropertySquare) => {
  const landlord = getPlayerById(game, property.ownerId!);

  let rent = 0;

  if (property.propertyType === PropertyType.station) {
    const stations = getPlayerActiveStations(game, landlord.id);
    rent = getStationRent(stations.length);
  } else if (property.propertyType === PropertyType.street) {
    rent = getStreetRent(property.price, {
      ownsNeighborhood: ownsNeighborhood(game, property),
      housesNumber: property.houses,
    });
  } else {
    const utilities = getPlayerActiveUtilities(game, landlord.id);
    const utilityRentMultiplier = getUtilityRentMultiplier(utilities.length);
    const movement = getDiceMovement(game.dice);
    rent = movement * utilityRentMultiplier;
  }

  return rent;
};

export const getSellHouseAmount = (property: StreetSquare) => {
  return Math.round(property.price * houseSellPercentage);
};

export const getStationRent = (stationsNumber: number) => {
  return stationRents[stationsNumber];
};

export const getStreetRent = (
  price: number,
  { ownsNeighborhood, housesNumber }: { ownsNeighborhood?: boolean; housesNumber?: number } = {},
) => {
  return Math.round(
    housesNumber
      ? houseRents[housesNumber] * price
      : rentPercentage * price * (ownsNeighborhood ? 2 : 1),
  );
};

export const getUtilityRentMultiplier = (utilitiesNumber: number) => {
  return utilitiesNumber === 2 ? 10 : 4;
};
