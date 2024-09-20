import { EventType, PropertyStatus } from '../enums';
import { getClearMortgageAmount, getMortgageAmount } from '../logic';
import {
  Game,
  Game_BuyingLiquidation,
  Game_PaymentLiquidation,
  Game_Play,
  Game_RollDice,
  PropertySquare,
} from '../types';

export const triggerClearMortgage = (
  game: Game_Play | Game_RollDice,
  property: PropertySquare,
): Game => {
  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: property.ownerId!,
        propertyId: property.id,
        type: EventType.clearMortgage,
      },
    ],
    players: game.players.map((p) => {
      return p.id === property.ownerId
        ? {
            ...p,
            money: p.money - getClearMortgageAmount(property),
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === property.id
        ? {
            ...s,
            status: undefined,
          }
        : s;
    }),
  };
};

export const triggerMortgage = (
  game: Game_BuyingLiquidation | Game_PaymentLiquidation | Game_Play | Game_RollDice,
  property: PropertySquare,
): Game => {
  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: property.ownerId!,
        propertyId: property.id,
        type: EventType.mortgage,
      },
    ],
    players: game.players.map((p) => {
      return p.id === property.ownerId
        ? {
            ...p,
            money: p.money + getMortgageAmount(property),
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === property.id
        ? {
            ...s,
            status: PropertyStatus.mortgaged,
          }
        : s;
    }),
  };
};
