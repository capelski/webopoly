import { EventType, GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game_BuyProperty, Game_Play, Player, PropertySquare } from '../types';

export const triggerBuyProperty = (
  game: Game_BuyProperty,
  propertySquare: PropertySquare,
  buyerId: Player['id'],
): Game_Play => {
  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.endTurn },
    },
    notifications: [
      ...game.notifications,
      {
        playerId: buyerId,
        propertyId: propertySquare.id,
        type: EventType.buyProperty,
      },
    ],
    phase: GamePhase.play,
    players: game.players.map((p) => {
      return p.id === buyerId
        ? {
            ...p,
            properties: p.properties.concat([propertySquare.id]),
            money: p.money - propertySquare.price,
          }
        : p;
    }),
    squares: game.squares.map((s) => {
      return s.id === propertySquare.id ? { ...s, ownerId: buyerId } : s;
    }),
  };
};

export const triggerRejectProperty = (game: Game_BuyProperty): Game_BuyProperty | Game_Play => {
  const { potentialBuyersId } = game.phaseData;

  if (potentialBuyersId.length === 0) {
    return {
      ...game,
      defaultAction: {
        playerId: getCurrentPlayer(game, { omitTurnConsiderations: true }).id,
        update: { type: GameUpdateType.endTurn },
      },
      phase: GamePhase.play,
    };
  }

  const nextPotentialBuyersId = [...potentialBuyersId];
  const nextCurrentBuyerId = nextPotentialBuyersId.shift()!;

  return {
    ...game,
    defaultAction: {
      playerId: nextCurrentBuyerId,
      update: { type: GameUpdateType.buyPropertyReject },
    },
    phase: GamePhase.buyProperty,
    phaseData: {
      currentBuyerId: nextCurrentBuyerId,
      potentialBuyersId: nextPotentialBuyersId,
    },
  };
};
