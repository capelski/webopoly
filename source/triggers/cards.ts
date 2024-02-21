import { CardType, EventSource, EventType, GamePhase, PromptType } from '../enums';
import {
  cards,
  getCardById,
  getCurrentPlayer,
  getNextPropertyOfTypeId,
  getNextSquareId,
  shuffleArray,
} from '../logic';
import { Card, GamePlayPhase, GamePromptPhase, Id } from '../types';
import { triggerGetOutOfJailCard, triggerGoToJail } from './jail';
import { MovePlayerOutputPhases, triggerMovePlayer } from './move-player';
import { triggerExpense, triggerRepairsExpense, triggerWindfall } from './payments';

type CardTrigger<TCard extends CardType = CardType> = (
  game: GamePromptPhase<PromptType.card>,
  playerId: Id,
  card: Card<TCard>,
) => MovePlayerOutputPhases;

const pushCardEvent = (
  game: MovePlayerOutputPhases,
  playerId: Id,
  card: Card,
): MovePlayerOutputPhases => {
  return {
    ...game,
    eventHistory: [
      {
        cardId: card.id,
        playerId,
        type: EventType.card,
      },
      ...game.eventHistory,
    ],
  };
};

const cardTriggersMap: { [TCard in CardType]: CardTrigger<TCard> } = {
  [CardType.advance]: (game, playerId, card) => {
    const nextGame = triggerMovePlayer(game, card.squareId);
    return pushCardEvent(nextGame, playerId, card);
  },
  [CardType.advanceNext]: (game, playerId, card) => {
    const nextSquareId = getNextPropertyOfTypeId(game, card.propertyType);
    const nextGame = triggerMovePlayer(game, nextSquareId);
    return pushCardEvent(nextGame, playerId, card);
  },
  [CardType.fee]: (game, playerId, card) => {
    return triggerExpense(game, {
      amount: card.amount,
      cardId: card.id,
      playerId,
      source: EventSource.surpriseCard,
      type: EventType.expense,
    });
  },
  [CardType.goBackSpaces]: (game, playerId, card) => {
    const nextSquareId = getNextSquareId(game, -3);
    const nextGame = triggerMovePlayer(game, nextSquareId, { preventPassGo: true });
    return pushCardEvent(nextGame, playerId, card);
  },
  [CardType.goToJail]: (game, playerId, card) => {
    const nextGame = triggerGoToJail(game);
    return pushCardEvent(nextGame, playerId, card);
  },
  [CardType.outOfJailCard]: (game, playerId, card) => {
    const nextGame = triggerGetOutOfJailCard(game);
    return pushCardEvent(nextGame, playerId, card);
  },
  [CardType.streetRepairs]: (game, playerId, card) => {
    return triggerRepairsExpense(game, card.housePrice, {
      cardId: card.id,
      playerId,
      source: EventSource.surpriseCard,
      type: EventType.expense,
    });
  },
  [CardType.windfall]: (game, playerId, card) => {
    const nextGame = triggerWindfall(game, card.amount);
    return pushCardEvent(nextGame, playerId, card);
  },
};

export const triggerCardAction = (
  game: GamePromptPhase<PromptType.card>,
  cardId: Id,
): MovePlayerOutputPhases => {
  const card = getCardById(cardId);
  const cardTrigger: CardTrigger = cardTriggersMap[card.type];
  const currentPlayer = getCurrentPlayer(game);

  return cardTrigger(game, currentPlayer.id, card);
};

export const triggerCardPrompt = (
  game: GamePlayPhase | GamePromptPhase<PromptType.card>,
): GamePromptPhase<PromptType.card> => {
  let nextCardIds = [...game.nextCardIds];

  if (nextCardIds.length === 0) {
    nextCardIds = shuffleArray(cards.map((card) => card.id));
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
