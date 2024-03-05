import { EventType, GamePhase, PromptType } from '../enums';
import { GamePlayPhase, GamePromptPhase, Player, PropertySquare } from '../types';

export const triggerBuyProperty = (
  game: GamePromptPhase<PromptType.buyProperty>,
  propertySquare: PropertySquare,
  buyerId: Player['id'],
): GamePlayPhase => {
  return {
    ...game,
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

export const triggerRejectProperty = (
  game: GamePromptPhase<PromptType.buyProperty>,
): GamePromptPhase<PromptType.buyProperty> | GamePlayPhase => {
  const { potentialBuyersId } = game.prompt;

  if (potentialBuyersId.length === 0) {
    return { ...game, phase: GamePhase.play };
  }

  const nextPotentialBuyersId = [...potentialBuyersId];
  const nextCurrentBuyerId = nextPotentialBuyersId.shift()!;

  return {
    ...game,
    phase: GamePhase.prompt,
    prompt: {
      currentBuyerId: nextCurrentBuyerId,
      potentialBuyersId: nextPotentialBuyersId,
      type: PromptType.buyProperty,
    },
  };
};
