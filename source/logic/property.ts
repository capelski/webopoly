import { PropertyStatus, PropertyType, SquareType } from '../enums';
import {
  clearMortgageRate,
  houseRents,
  houseSellPercentage,
  housesMax,
  mortgagePercentage,
  rentPercentage,
  stationRent,
} from '../parameters';
import { Game, Id, Player, PropertySquare, Square } from '../types';
import { getPlayerById, getSquareById } from './game';

export const buildHouse = (game: Game, squareId: Id): Game => {
  const property = getSquareById(game, squareId);

  if (property.type !== SquareType.property || property.propertyType !== PropertyType.street) {
    return game;
  }

  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId
        ? {
            ...p,
            money: p.money - property.housePrice,
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === property.id ? { ...s, houses: (property.houses || 0) + 1 } : s;
    }),
  };
};

export const buyProperty = (game: Game, squareId: Id): Game => {
  const property = getSquareById(game, squareId);

  if (property.type !== SquareType.property) {
    return game;
  }

  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId
        ? {
            ...p,
            properties: p.properties.concat([property.id]),
            money: p.money - property.price,
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === property.id ? { ...s, ownerId: game.currentPlayerId } : s;
    }),
  };
};

export const canBuildHouse = (game: Game, property: PropertySquare, player: Player): boolean => {
  if (property.propertyType !== PropertyType.street) {
    return false;
  }

  const neighborhoodStreets = getNeighborhoodStreets(game.squares, property);
  const allOwned = neighborhoodStreets.every((p) => p.ownerId === player.id);
  const minHousesNumber = neighborhoodStreets.reduce(
    (reduced, p) => Math.min(reduced, p.houses || 0),
    housesMax,
  );
  const housesNumber = property.houses || 0;
  const balancedHousesNumber = housesNumber <= minHousesNumber;

  return (
    allOwned &&
    housesNumber < housesMax &&
    balancedHousesNumber &&
    player.money >= property.housePrice
  );
};

export const canBuyProperty = (property: PropertySquare, player: Player): boolean => {
  return property.ownerId === undefined && player.money >= property.price;
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
    (property.propertyType !== PropertyType.street || !property.houses)
  );
};

export const canSellHouse = (game: Game, property: PropertySquare, player: Player): boolean => {
  if (property.propertyType !== PropertyType.street) {
    return false;
  }

  const neighborhoodStreets = getNeighborhoodStreets(game.squares, property);
  const maxHousesNumber = neighborhoodStreets.reduce(
    (reduced, p) => Math.max(reduced, p.houses || 0),
    0,
  );
  const housesNumber = property.houses || 0;
  const balancedHousesNumber = housesNumber >= maxHousesNumber;

  return property.ownerId === player.id && housesNumber > 0 && balancedHousesNumber;
};

export const clearMortgage = (game: Game, squareId: Id): Game => {
  const property = getSquareById(game, squareId);

  if (property.type !== SquareType.property) {
    return game;
  }

  return {
    ...game,
    squares: game.squares.map((s) => {
      return s.id === squareId
        ? {
            ...s,
            status: undefined,
          }
        : s;
    }),
    players: game.players.map((p) => {
      return p.id === property.ownerId
        ? {
            ...p,
            money: p.money - getClearMortgageAmount(property),
          }
        : p;
    }),
  };
};

const getClearMortgageAmount = (property: PropertySquare) => {
  return mortgagePercentage * property.price * clearMortgageRate;
};

const getNeighborhoodStreets = (
  squares: Square[],
  property: PropertySquare,
): (PropertySquare & { propertyType: PropertyType.street })[] => {
  if (property.propertyType !== PropertyType.street) {
    return [];
  }

  return squares.filter(
    (p) =>
      p.type === SquareType.property &&
      p.propertyType === PropertyType.street &&
      p.neighborhood === property.neighborhood,
    // TODO Subtypes for propertySquares
  ) as (PropertySquare & { propertyType: PropertyType.street })[];
};

export const getRentAmount = (game: Game, property: PropertySquare, movement: number) => {
  const landlord = getPlayerById(game, property.ownerId!);
  const properties = landlord.properties.map(
    (propertyId) => game.squares.find((s) => s.id === propertyId)!,
  );
  let rent = 0;

  if (property.propertyType === PropertyType.station) {
    const stations = properties.filter(
      (p) => p.type === SquareType.property && p.propertyType === PropertyType.station,
    );
    rent = stationRent * stations.length;
  } else if (property.propertyType === PropertyType.street) {
    if (property.houses !== undefined && property.houses > 0) {
      rent = houseRents[property.houses];
    } else {
      const neighborhoodStreets = getNeighborhoodStreets(game.squares, property);
      const ownedStreets = neighborhoodStreets.filter((p) => p.ownerId === landlord.id);

      rent =
        property.price *
        rentPercentage *
        (ownedStreets.length === neighborhoodStreets.length ? 2 : 1);
    }
  } else {
    const utilityProperties = properties.filter(
      (p) => p.type === SquareType.property && p.propertyType === PropertyType.utility,
    );
    rent = movement * (utilityProperties.length === 2 ? 10 : 4);
  }

  return rent;
};

export const mortgage = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);

  if (square.type !== SquareType.property) {
    return game;
  }

  return {
    ...game,
    squares: game.squares.map((s) => {
      return s.id === squareId
        ? {
            ...s,
            status: PropertyStatus.mortgaged,
          }
        : s;
    }),
    players: game.players.map((p) => {
      return p.id === square.ownerId
        ? {
            ...p,
            money: p.money + mortgagePercentage * square.price,
          }
        : p;
    }),
  };
};

export const sellHouse = (game: Game, squareId: Id): Game => {
  const property = getSquareById(game, squareId);

  if (property.type !== SquareType.property || property.propertyType !== PropertyType.street) {
    return game;
  }

  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId
        ? {
            ...p,
            money: p.money + houseSellPercentage * property.housePrice,
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === property.id ? { ...s, houses: (property.houses || 0) - 1 } : s;
    }),
  };
};
