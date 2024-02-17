import { EventType, LiquidationReason, PropertyStatus } from '../enums';
import {
  canBuildHouse,
  canSellHouse,
  getBuildHouseAmount,
  getPlayerById,
  getSellHouseAmount,
} from '../logic';
import {
  Game,
  GameLiquidationPhase,
  GamePlayPhase,
  GameRollDicePhase,
  StreetSquare,
} from '../types';

export const triggerBuildHouse = (
  game: GamePlayPhase | GameRollDicePhase,
  street: StreetSquare,
): Game => {
  if (street.status === PropertyStatus.mortgaged || !street.ownerId) {
    return game;
  }

  const player = getPlayerById(game, street.ownerId);
  if (!canBuildHouse(game, street, player)) {
    return game;
  }

  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: street.ownerId,
        propertyId: street.id,
        type: EventType.buildHouse,
      },
    ],
    players: game.players.map((p) => {
      return p.id === player.id
        ? {
            ...p,
            money: p.money - getBuildHouseAmount(street),
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === street.id ? { ...s, houses: street.houses + 1 } : s;
    }),
  };
};

export const triggerSellHouse = (
  game: GameLiquidationPhase<LiquidationReason> | GamePlayPhase | GameRollDicePhase,
  street: StreetSquare,
): Game => {
  if (!street.ownerId) {
    return game;
  }

  const player = getPlayerById(game, street.ownerId);
  if (!canSellHouse(game, street, player)) {
    return game;
  }

  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: street.ownerId,
        propertyId: street.id,
        type: EventType.sellHouse,
      },
    ],
    players: game.players.map((p) => {
      return p.id === player.id
        ? {
            ...p,
            money: p.money + getSellHouseAmount(street),
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === street.id ? { ...s, houses: street.houses - 1 } : s;
    }),
  };
};
