import { EventType, GamePhase, PromptType } from '../enums';
import { getCurrentPlayer, getSurpriseCardById, shuffleArray, surpriseCards } from '../logic';
import { CardPrompt, GamePlayPhase, GamePromptPhase } from '../types';
import { MovePlayerOutputPhases } from './move-player';

export const triggerCardAction = (
  game: GamePromptPhase<PromptType.card>,
  prompt: CardPrompt,
): MovePlayerOutputPhases => {
  const card = getSurpriseCardById(prompt.cardId);
  const currentPlayer = getCurrentPlayer(game);

  const nextGame: GamePromptPhase<PromptType.card> = {
    ...game,
    eventHistory: card.skipEvent
      ? game.eventHistory
      : [
          {
            cardId: prompt.cardId,
            playerId: currentPlayer.id,
            type: EventType.card,
          },
          ...game.eventHistory,
        ],
  };

  return card.action(nextGame);
};

export const triggerCardPrompt = (
  game: GamePlayPhase | GamePromptPhase<PromptType.card>,
): GamePromptPhase<PromptType.card> => {
  let nextCardIds = [...game.nextCardIds];

  if (nextCardIds.length === 0) {
    nextCardIds = shuffleArray(surpriseCards.map((card) => card.id));
  }

  const cardId = nextCardIds.shift()!;

  return {
    ...game,
    nextCardIds,
    phase: GamePhase.prompt,
    prompt: {
      cardId,
      type: PromptType.card,
    },
  };
};
