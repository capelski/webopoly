import { EventType, LiquidationReason, PropertyStatus } from '../enums';
import { getClearMortgageAmount, getMortgageAmount } from '../logic';
import {
  Game,
  GameLiquidationPhase,
  GamePlayPhase,
  GameRollDicePhase,
  PropertySquare,
} from '../types';

export const triggerClearMortgage = (
  game: GamePlayPhase | GameRollDicePhase,
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
  game: GameLiquidationPhase<LiquidationReason> | GamePlayPhase | GameRollDicePhase,
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
