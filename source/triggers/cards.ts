import { CardType, EventType, GamePhase, PromptType } from '../enums';
import {
  chanceCards,
  communityChestCards,
  getChanceCardById,
  getCommunityChestCardById,
  shuffleArray,
} from '../logic';
import { CardPrompt, GamePlayPhase, GamePromptPhase } from '../types';
import { MovePlayerOutputPhases } from './move-player';

export const triggerCardAction = (
  game: GamePromptPhase<PromptType.card>,
  prompt: CardPrompt,
): MovePlayerOutputPhases => {
  const card =
    prompt.cardType === CardType.chance
      ? getChanceCardById(prompt.cardId)
      : getCommunityChestCardById(prompt.cardId);

  const nextGame: GamePromptPhase<PromptType.card> = {
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
  };

  return card.action(nextGame);
};

export const triggerCardPrompt = (
  game: GamePlayPhase | GamePromptPhase<PromptType.card>,
  cardType: CardType,
): GamePromptPhase<PromptType.card> => {
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
    phase: GamePhase.prompt,
    prompt: {
      cardId,
      cardType,
      type: PromptType.card,
    },
  };
};
