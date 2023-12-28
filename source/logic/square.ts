import { PropertyStatus, SquareType } from '../enums';
import { clearMortgageRate, mortgagePercentage } from '../parameters';
import { Game, Id, PropertySquare, Square } from '../types';
import { getSquareById } from './game';

export const canClearMortgage = (property: PropertySquare): boolean => {
  // TODO And owner has enough money
  return property.ownerId !== undefined && property.status === PropertyStatus.mortgaged;
};

export const canMortgage = (property: PropertySquare): boolean => {
  // TODO Number of houses === 0 if property === street;
  return property.ownerId !== undefined && property.status !== PropertyStatus.mortgaged;
};

export const clearMortgage = (game: Game, squareId: Id): Game => {
  const property = toPropertySquare(getSquareById(game, squareId));

  if (!property) {
    return game;
  }

  return {
    ...game,
    squares: game.squares.map((s) => {
      return s.type === SquareType.street && s.id === squareId
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
            money: p.money - mortgagePercentage * property.price * clearMortgageRate,
          }
        : p;
    }),
  };
};

export const mortgage = (game: Game, squareId: Id): Game => {
  const property = toPropertySquare(getSquareById(game, squareId));

  if (!property) {
    return game;
  }

  return {
    ...game,
    squares: game.squares.map((s) => {
      return s.type === SquareType.street && s.id === squareId
        ? {
            ...s,
            status: PropertyStatus.mortgaged,
          }
        : s;
    }),
    players: game.players.map((p) => {
      return p.id === property.ownerId
        ? {
            ...p,
            money: p.money + mortgagePercentage * property.price,
          }
        : p;
    }),
  };
};

export const toPropertySquare = (square: Square): PropertySquare | undefined => {
  return square.type === SquareType.station ||
    square.type === SquareType.street ||
    square.type === SquareType.utility
    ? square
    : undefined;
};
