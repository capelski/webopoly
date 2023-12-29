import { PropertyStatus, SquareType } from '../enums';
import { clearMortgageRate, mortgagePercentage } from '../parameters';
import { Game, Id, PropertySquare } from '../types';
import { getSquareById } from './game';

export const canClearMortgage = (property: PropertySquare, playerId: Id): boolean => {
  // TODO And owner has enough money
  return property.ownerId === playerId && property.status === PropertyStatus.mortgaged;
};

export const canMortgage = (property: PropertySquare, playerId: Id): boolean => {
  // TODO Number of houses === 0 if property === street;
  return property.ownerId === playerId && property.status !== PropertyStatus.mortgaged;
};

export const clearMortgage = (game: Game, squareId: Id): Game => {
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
            status: undefined,
          }
        : s;
    }),
    players: game.players.map((p) => {
      return p.id === square.ownerId
        ? {
            ...p,
            money: p.money - mortgagePercentage * square.price * clearMortgageRate,
          }
        : p;
    }),
  };
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
