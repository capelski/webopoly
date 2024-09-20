import { EventType } from '../enums';
import { getBuildHouseAmount, getCurrentPlayer, getSellHouseAmount } from '../logic';
import {
  Game_BuyingLiquidation,
  Game_PaymentLiquidation,
  Game_Play,
  Game_RollDice,
  StreetSquare,
} from '../types';

export const triggerBuildHouse = (
  game: Game_Play | Game_RollDice,
  street: StreetSquare,
): Game_Play | Game_RollDice => {
  const currentPlayer = getCurrentPlayer(game);

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
  game: Game_BuyingLiquidation | Game_PaymentLiquidation | Game_Play | Game_RollDice,
  street: StreetSquare,
): Game_BuyingLiquidation | Game_PaymentLiquidation | Game_Play | Game_RollDice => {
  const currentPlayer = getCurrentPlayer(game);

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
