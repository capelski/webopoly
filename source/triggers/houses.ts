import { ChangeType, PropertyType, SquareType, UiUpdateType } from '../enums';
import {
  canBuildHouse,
  canSellHouse,
  getBuildHouseAmount,
  getPlayerById,
  getSellHouseAmount,
  getSquareById,
} from '../logic';
import { Game, Id } from '../types';

export const triggerBuildHouse = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);
  if (
    square.type !== SquareType.property ||
    square.propertyType !== PropertyType.street ||
    !square.ownerId
  ) {
    return game;
  }

  const player = getPlayerById(game, square.ownerId);
  if (!canBuildHouse(game, square, player)) {
    return game;
  }

  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId
        ? {
            ...p,
            money: p.money - getBuildHouseAmount(square),
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === square.id ? { ...s, houses: square.houses + 1 } : s;
    }),
    uiUpdates: [
      {
        playerId: square.ownerId,
        propertyId: squareId,
        type: ChangeType.buildHouse,
        uiUpdateType: UiUpdateType.notification,
      },
    ],
  };
};

export const triggerSellHouse = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);
  if (
    square.type !== SquareType.property ||
    square.propertyType !== PropertyType.street ||
    !square.ownerId
  ) {
    return game;
  }

  const player = getPlayerById(game, square.ownerId);
  if (!canSellHouse(game, square, player)) {
    return game;
  }

  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId
        ? {
            ...p,
            money: p.money + getSellHouseAmount(square),
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === square.id ? { ...s, houses: square.houses - 1 } : s;
    }),
    uiUpdates: [
      {
        playerId: square.ownerId,
        propertyId: squareId,
        type: ChangeType.sellHouse,
        uiUpdateType: UiUpdateType.notification,
      },
    ],
  };
};
