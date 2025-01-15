import { EventType, GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer } from '../logic';
import { Transition } from '../types';

export const triggerBuyPropertyAccept: Transition<GamePhase.buyProperty, 'playerBuys'> = (
  game,
  propertySquare,
  buyerId,
) => {
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

export const triggerBuyPropertyDecline: Transition<GamePhase.buyProperty, 'playerDeclines'> = (
  game,
) => {
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
