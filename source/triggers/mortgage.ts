import { ChangeType, PropertyStatus, SquareType, UiUpdateType } from '../enums';
import {
  canClearMortgage,
  canMortgage,
  getClearMortgageAmount,
  getMortgageAmount,
  getPlayerById,
  getSquareById,
} from '../logic';
import { Game, Id } from '../types';

export const triggerClearMortgage = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);
  if (square.type !== SquareType.property || !square.ownerId) {
    return game;
  }

  const player = getPlayerById(game, square.ownerId);
  if (!canClearMortgage(square, player)) {
    return game;
  }

  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === square.ownerId
        ? {
            ...p,
            money: p.money - getClearMortgageAmount(square),
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === squareId
        ? {
            ...s,
            status: undefined,
          }
        : s;
    }),
    uiUpdates: [
      {
        playerId: square.ownerId,
        propertyId: squareId,
        type: ChangeType.clearMortgage,
        uiUpdateType: UiUpdateType.notification,
      },
    ],
  };
};

export const triggerMortgage = (game: Game, squareId: Id): Game => {
  const square = getSquareById(game, squareId);

  if (
    square.type !== SquareType.property ||
    !square.ownerId ||
    !canMortgage(square, square.ownerId)
  ) {
    return game;
  }

  return {
    ...game,
    players: game.players.map((p) => {
      return p.id === square.ownerId
        ? {
            ...p,
            money: p.money + getMortgageAmount(square),
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === squareId
        ? {
            ...s,
            status: PropertyStatus.mortgaged,
          }
        : s;
    }),
    uiUpdates: [
      {
        playerId: square.ownerId,
        propertyId: squareId,
        type: ChangeType.mortgage,
        uiUpdateType: UiUpdateType.notification,
      },
    ],
  };
};
