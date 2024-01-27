import { CardType, PromptType } from '../enums';
import { chanceCards, communityChestCards, shuffleArray } from '../logic';
import { Game } from '../types';

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
    prompt: {
      cardId,
      cardType,
      type: PromptType.card,
    },
  };
};
