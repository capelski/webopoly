import { CardType, EventType, GamePhase, GameUpdateType } from '../enums';
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
import { Card, CardEvent, Game, Player, Transition } from '../types';
import { EndTurnOutputPhases } from './end-turn';
import { triggerGetOutOfJailCard, triggerGoToJail } from './jail';
import { MovePlayerOutputPhases, triggerMovePlayer } from './move-player';
import { triggerCannotPay } from './payments';

type GameInputType<TCard extends CardType> = TCard extends CardType.fee
  ? Game<GamePhase.applyCard> | Game<GamePhase.paymentLiquidation>
  : TCard extends CardType.streetRepairs
  ? Game<GamePhase.applyCard> | Game<GamePhase.paymentLiquidation>
  : Game<GamePhase.applyCard>;

type GameOutputType<TCard extends CardType> = TCard extends CardType.fee
  ? Game<GamePhase.cannotPay> | Game<GamePhase.play>
  : TCard extends CardType.streetRepairs
  ? Game<GamePhase.cannotPay> | Game<GamePhase.play>
  : MovePlayerOutputPhases | EndTurnOutputPhases;

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
      return triggerCannotPay(game, event);
    }

    const nextGame: Game<GamePhase.play> = {
      ...game,
      defaultAction: { playerId: player.id, update: { type: GameUpdateType.endTurn } },
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
    return triggerGoToJail(game, true);
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
      return triggerCannotPay(game, event);
    }

    const nextGame: Game<GamePhase.play> = {
      ...game,
      defaultAction: { playerId: player.id, update: { type: GameUpdateType.endTurn } },
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
      defaultAction: { playerId: player.id, update: { type: GameUpdateType.endTurn } },
      phase: GamePhase.play,
      players: game.players.map((p) => {
        return p.id === player.id ? { ...p, money: p.money + card.amount } : p;
      }),
    };
  },
};

export const triggerApplyCard = <TCard extends CardType = CardType>(
  game: GameInputType<TCard>,
  cardId: Card['id'],
): GameOutputType<TCard> => {
  const card = cardsMap[cardId] as Card<TCard>;
  const cardTrigger: CardTrigger<TCard> = cardTriggersMap[card.type];
  const currentPlayer = getCurrentPlayer(game);

  let nextGame = cardTrigger(game, currentPlayer, card);
  if (nextGame.phase !== GamePhase.cannotPay) {
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

const triggerCardPrompt = (
  game: Game<GamePhase.applyCard> | Game<GamePhase.avatarAnimation>,
): Game<GamePhase.drawCard> => {
  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.drawCard },
    },
    phase: GamePhase.drawCard,
  };
};

export const triggerCardPrompt_card: Transition<
  GamePhase.applyCard,
  'landsInSurpriseSquareFromCard'
> = triggerCardPrompt;

export const triggerCardPrompt_move: Transition<
  GamePhase.avatarAnimation,
  'landsInSurpriseSquare'
> = triggerCardPrompt;

export const triggerDrawCard: Transition<GamePhase.drawCard, 'drawCard'> = (game) => {
  let nextCardIds = [...game.nextCardIds];

  if (nextCardIds.length === 0) {
    nextCardIds = shuffleArray(cards.map((card) => card.id));
  }

  const cardId = nextCardIds.shift()!;

  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.applyCard },
    },
    nextCardIds,
    phase: GamePhase.applyCard,
    phaseData: {
      cardId,
    },
  };
};
