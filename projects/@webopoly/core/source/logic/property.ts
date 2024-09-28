import {
  clearMortgageRate,
  houseBuildPercentage,
  houseRents,
  houseSellPercentage,
  mortgagePercentage,
  rentPercentage,
  stationRents,
} from '../constants';
import { PropertyType } from '../enums';
import { Game, PropertySquare, StreetSquare } from '../types';
import { getDiceMovement } from './dice';
import { getPlayerById } from './game';
import { getPlayerActiveStations, getPlayerActiveUtilities, ownsNeighborhood } from './player';

export const getBuildHouseAmount = (property: StreetSquare) => {
  return Math.round(property.price * houseBuildPercentage);
};

export const getClearMortgageAmount = (property: PropertySquare) => {
  return Math.round(mortgagePercentage * property.price * clearMortgageRate);
};

export const getMortgageAmount = (property: PropertySquare) => {
  return Math.round(mortgagePercentage * property.price);
};

export const getRentAmount = (game: Game<any>, property: PropertySquare) => {
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
