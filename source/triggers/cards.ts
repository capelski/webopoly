import { CardType, EventType, GamePhase, PromptType } from '../enums';
import {
  chanceCards,
  communityChestCards,
  getChanceCardById,
  getCommunityChestCardById,
  shuffleArray,
} from '../logic';
import { CardPrompt, Game } from '../types';

export const triggerCardAction = (game: Game, prompt: CardPrompt): Game => {
  const card =
    prompt.cardType === CardType.chance
      ? getChanceCardById(prompt.cardId)
      : getCommunityChestCardById(prompt.cardId);

  const nextGame: Game = {
    ...game,
    eventHistory: card.skipEvent
      ? game.eventHistory
      : [
          {
            cardId: prompt.cardId,
            cardType: prompt.cardType,
            playerId: game.currentPlayerId,
            type: EventType.card,
          },
          ...game.eventHistory,
        ],
    status: GamePhase.play,
  };

  return card.action(nextGame);
};

export const triggerCardPrompt = (game: Game, cardType: CardType): Game => {
  const nextCardIs = {
    nextChanceCardIds: game.nextChanceCardIds,
    nextCommunityCardIds: game.nextCommunityCardIds,
  };
  const accessor = cardType === CardType.chance ? 'nextChanceCardIds' : 'nextCommunityCardIds';

  if (nextCardIs[accessor].length === 0) {
    const cardsPool = cardType === CardType.chance ? chanceCards : communityChestCards;
    nextCardIs[accessor] = shuffleArray(cardsPool.map((card) => card.id));
  }

  const cardId = nextCardIs[accessor].shift()!;

  return {
    ...game,
    ...nextCardIs,
    status: {
      cardId,
      cardType,
      type: PromptType.card,
    },
  };
};
