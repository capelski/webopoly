import { PropertyStatus, SquareType } from '../enums';
import { clearMortgageRate, mortgagePercentage } from '../parameters';
import { Game, Id, Player, PropertySquare } from '../types';
import { getSquareById } from './game';

export const buyProperty = (game: Game, property: PropertySquare): Game => {
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
  // TODO Number of houses === 0 if property === street;
  return property.ownerId === playerId && property.status !== PropertyStatus.mortgaged;
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
