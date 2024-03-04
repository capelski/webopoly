import { EventType, LiquidationReason } from '../enums';
import {
  canBuildHouse,
  canSellHouse,
  getBuildHouseAmount,
  getCurrentPlayer,
  getSellHouseAmount,
} from '../logic';
import { GameLiquidationPhase, GamePlayPhase, GameRollDicePhase, StreetSquare } from '../types';

export const triggerBuildHouse = (
  game: GamePlayPhase | GameRollDicePhase,
  street: StreetSquare,
): GamePlayPhase | GameRollDicePhase => {
  const currentPlayer = getCurrentPlayer(game);
  if (!canBuildHouse(game, street, currentPlayer)) {
    return game;
  }

  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: currentPlayer.id,
        propertyId: street.id,
        type: EventType.buildHouse,
      },
    ],
    players: game.players.map((p) => {
      return p.id === currentPlayer.id
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
): GameLiquidationPhase<LiquidationReason> | GamePlayPhase | GameRollDicePhase => {
  const currentPlayer = getCurrentPlayer(game);
  if (!canSellHouse(game, street, currentPlayer)) {
    return game;
  }

  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: currentPlayer.id,
        propertyId: street.id,
        type: EventType.sellHouse,
      },
    ],
    players: game.players.map((p) => {
      return p.id === currentPlayer.id
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
