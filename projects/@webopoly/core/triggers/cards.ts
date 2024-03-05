import { CardType, EventType, GamePhase, LiquidationReason, PromptType } from '../enums';
import {
  cards,
  cardsMap,
  getCardAmount,
  getCurrentPlayer,
  getNextPropertyOfTypeId,
  getNextSquareId,
  hasEnoughMoney,
  shuffleArray,
} from '../logic';
import {
  Card,
  CardEvent,
  GameLiquidationPhase,
  GamePlayPhase,
  GamePromptPhase,
  Player,
} from '../types';
import { triggerGetOutOfJailCard, triggerGoToJail } from './jail';
import { MovePlayerOutputPhases, triggerMovePlayer } from './move-player';
import { triggerCannotPayPrompt } from './payments';

type GameInputType<TCard extends CardType> = TCard extends CardType.fee
  ? GamePromptPhase<PromptType.card> | GameLiquidationPhase<LiquidationReason.pendingPayment>
  : TCard extends CardType.streetRepairs
  ? GamePromptPhase<PromptType.card> | GameLiquidationPhase<LiquidationReason.pendingPayment>
  : GamePromptPhase<PromptType.card>;

type GameOutputType<TCard extends CardType> = TCard extends CardType.fee
  ? GamePromptPhase<PromptType.cannotPay> | GamePlayPhase
  : TCard extends CardType.streetRepairs
  ? GamePromptPhase<PromptType.cannotPay> | GamePlayPhase
  : MovePlayerOutputPhases;

type CardTrigger<TCard extends CardType> = (
  game: GameInputType<TCard>,
  player: Player,
  card: Card<TCard>,
) => GameOutputType<TCard>;

const cardTriggersMap: { [TCard in CardType]: CardTrigger<TCard> } = {
  [CardType.advance]: (game, _player, card) => {
    return triggerMovePlayer(game, card.squareId);
  },
  [CardType.advanceNext]: (game, _player, card) => {
    const nextSquareId = getNextPropertyOfTypeId(game, card.propertyType);
    return triggerMovePlayer(game, nextSquareId);
  },
  [CardType.fee]: (game, player, card) => {
    if (!hasEnoughMoney(player, card.amount)) {
      const event: CardEvent<typeof card.type> = {
        amount: undefined,
        cardId: card.id,
        playerId: player.id,
        type: EventType.card,
      };
      return triggerCannotPayPrompt(game, event);
    }

    const nextGame: GamePlayPhase = {
      ...game,
      centerPot: game.centerPot + card.amount,
      phase: GamePhase.play,
      players: game.players.map((p) => {
        return p.id === player.id ? { ...p, money: p.money - card.amount } : p;
      }),
    };

    return nextGame;
  },
  [CardType.goBackSpaces]: (game) => {
    const nextSquareId = getNextSquareId(game, -3);
    return triggerMovePlayer(game, nextSquareId, { preventPassGo: true });
  },
  [CardType.goToJail]: (game) => {
    return triggerGoToJail(game);
  },
  [CardType.outOfJailCard]: (game) => {
    return triggerGetOutOfJailCard(game);
  },
  [CardType.streetRepairs]: (game, player, card) => {
    const amount = getCardAmount(game, card.id);
    if (!hasEnoughMoney(player, amount)) {
      const event: CardEvent<typeof card.type> = {
        amount,
        cardId: card.id,
        playerId: player.id,
        type: EventType.card,
      };
      return triggerCannotPayPrompt(game, event);
    }

    const nextGame: GamePlayPhase = {
      ...game,
      centerPot: game.centerPot + amount,
      phase: GamePhase.play,
      players: game.players.map((p) => {
        return p.id === player.id ? { ...p, money: p.money - amount } : p;
      }),
    };

    return nextGame;
  },
  [CardType.windfall]: (game, player, card) => {
    return {
      ...game,
      phase: GamePhase.play,
      players: game.players.map((p) => {
        return p.id === player.id ? { ...p, money: p.money + card.amount } : p;
      }),
    };
  },
};

export const triggerCardAction = <TCard extends CardType = CardType>(
  game: GameInputType<TCard>,
  cardId: Card['id'],
): GameOutputType<TCard> => {
  const card = cardsMap[cardId] as Card<TCard>;
  const cardTrigger: CardTrigger<TCard> = cardTriggersMap[card.type];
  const currentPlayer = getCurrentPlayer(game);

  let nextGame = cardTrigger(game, currentPlayer, card);
  if (nextGame.phase !== GamePhase.prompt || nextGame.prompt.type !== PromptType.cannotPay) {
    nextGame = {
      ...nextGame,
      eventHistory: [
        {
          amount: getCardAmount(game, cardId),
          cardId: card.id,
          playerId: currentPlayer.id,
          type: EventType.card,
        },
        ...game.eventHistory,
      ],
    };
  }

  return nextGame;
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
