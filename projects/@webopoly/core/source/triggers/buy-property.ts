import { EventType, GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Game, Player, PropertySquare } from '../types';

export const triggerBuyPropertyAccept = (
  game: Game<GamePhase.buyProperty>,
  propertySquare: PropertySquare,
  buyerId: Player['id'],
): Game<GamePhase.play> => {
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

export const triggerBuyPropertyDecline = (
  game: Game<GamePhase.buyProperty>,
): Game<GamePhase.buyProperty> | Game<GamePhase.play> => {
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
      update: { type: GameUpdateType.buyPropertyDecline },
    },
    phase: GamePhase.buyProperty,
    phaseData: {
      currentBuyerId: nextCurrentBuyerId,
      potentialBuyersId: nextPotentialBuyersId,
    },
  };
};
