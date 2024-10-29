import { longActionInterval } from '../constants';
import { AnswerType, EventType, GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer, isSelectedForTrade } from '../logic';
import { DefaultAction, Game, PropertySquare, Transition } from '../types';

const triggerAcceptTrade = (
  game: Game<GamePhase.answerTrade_play> | Game<GamePhase.answerTrade_rollDice>,
): Game<any> => {
  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        answer: AnswerType.accept,
        playerId: game.phaseData.playerId,
        playerPropertiesId: game.phaseData.playerPropertiesId,
        targetPlayerId: game.phaseData.targetPlayerId,
        targetPropertiesId: game.phaseData.targetPropertiesId,
        type: EventType.answerTrade,
      },
    ],
    players: game.players.map((player) => {
      return player.id === game.phaseData.playerId
        ? {
            ...player,
            properties: player.properties
              .filter((squareId) => !game.phaseData.playerPropertiesId.includes(squareId))
              .concat(game.phaseData.targetPropertiesId),
          }
        : player.id === game.phaseData.targetPlayerId
        ? {
            ...player,
            properties: player.properties
              .filter((squareId) => !game.phaseData.targetPropertiesId.includes(squareId))
              .concat(game.phaseData.playerPropertiesId),
          }
        : player;
    }),
    squares: game.squares.map((square) => {
      return game.phaseData.playerPropertiesId.includes(square.id)
        ? { ...square, ownerId: game.phaseData.targetPlayerId }
        : game.phaseData.targetPropertiesId.includes(square.id)
        ? { ...square, ownerId: game.phaseData.playerId }
        : square;
    }),
  };
};

export const triggerAcceptTrade_play: Transition<GamePhase.answerTrade_play, 'answerTrade'> = (
  game,
) => {
  return {
    ...triggerAcceptTrade(game),
    defaultAction: {
      playerId: game.phaseData.playerId,
      update: { type: GameUpdateType.endTurn },
    },
    phase: GamePhase.play,
  };
};

export const triggerAcceptTrade_rollDice: Transition<
  GamePhase.answerTrade_rollDice,
  'answerTrade'
> = (game) => {
  return {
    ...triggerAcceptTrade(game),
    defaultAction: {
      playerId: game.phaseData.playerId,
      update: { type: GameUpdateType.rollDice },
    },
    phase: GamePhase.rollDice,
  };
};

export const triggerCancelTrade_play: Transition<GamePhase.trade_play, 'exitTrading'> = (game) => {
  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.endTurn },
    },
    phase: GamePhase.play,
  };
};

export const triggerCancelTrade_rollDice: Transition<GamePhase.trade_rollDice, 'exitTrading'> = (
  game,
) => {
  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.rollDice },
    },
    phase: GamePhase.rollDice,
  };
};

const triggerDeclineTrade = (
  game: Game<GamePhase.answerTrade_play> | Game<GamePhase.answerTrade_rollDice>,
): Game<any> => {
  return {
    ...game,
    defaultAction: {
      playerId: game.phaseData.playerId,
      update:
        game.phase === GamePhase.answerTrade_play
          ? { type: GameUpdateType.endTurn }
          : { type: GameUpdateType.rollDice },
    },
    notifications: [
      ...game.notifications,
      {
        answer: AnswerType.decline,
        playerId: game.phaseData.playerId,
        playerPropertiesId: game.phaseData.playerPropertiesId,
        targetPlayerId: game.phaseData.targetPlayerId,
        targetPropertiesId: game.phaseData.targetPropertiesId,
        type: EventType.answerTrade,
      },
    ],
  };
};

export const triggerDeclineTrade_play: Transition<GamePhase.answerTrade_play, 'answerTrade'> = (
  game,
) => {
  return {
    ...triggerDeclineTrade(game),
    phase: GamePhase.play,
  };
};

export const triggerDeclineTrade_rollDice: Transition<
  GamePhase.answerTrade_rollDice,
  'answerTrade'
> = (game) => {
  return {
    ...triggerDeclineTrade(game),
    phase: GamePhase.rollDice,
  };
};

const triggerStartTrade = (game: Game<GamePhase.play> | Game<GamePhase.rollDice>) => {
  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.cancelTrade },
      interval: longActionInterval * 1000,
    } as DefaultAction,
    phaseData: {
      other: {
        ownerId: undefined,
        squaresId: [],
      },
      ownSquaresId: [],
    },
  };
};

export const triggerStartTrade_play: Transition<GamePhase.play, 'enterTrading'> = (game) => {
  return {
    ...triggerStartTrade(game),
    phase: GamePhase.trade_play,
  };
};

export const triggerStartTrade_rollDice: Transition<GamePhase.rollDice, 'enterTrading'> = (
  game,
) => {
  return {
    ...triggerStartTrade(game),
    phase: GamePhase.trade_rollDice,
  };
};

const triggerTradeOffer = (game: Game<GamePhase.trade_play> | Game<GamePhase.trade_rollDice>) => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    phaseData: {
      playerId: currentPlayer.id,
      playerPropertiesId: game.phaseData.ownSquaresId,
      targetPlayerId: game.phaseData.other.ownerId!,
      targetPropertiesId: game.phaseData.other.squaresId,
    },
  };
};

export const triggerTradeOffer_play: Transition<GamePhase.trade_play, 'sendTradingOffer'> = (
  game,
) => {
  return {
    ...triggerTradeOffer(game),
    defaultAction: {
      playerId: game.phaseData.other.ownerId!,
      update: { type: GameUpdateType.declineTrade },
    },
    phase: GamePhase.answerTrade_play,
  };
};

export const triggerTradeOffer_rollRice: Transition<
  GamePhase.trade_rollDice,
  'sendTradingOffer'
> = (game) => {
  return {
    ...triggerTradeOffer(game),
    defaultAction: {
      playerId: game.phaseData.other.ownerId!,
      update: { type: GameUpdateType.declineTrade },
    },
    phase: GamePhase.answerTrade_rollDice,
  };
};

const triggerTradeSelectionToggle = (
  game: Game<GamePhase.trade_play> | Game<GamePhase.trade_rollDice>,
  square: PropertySquare,
) => {
  const currentPlayer = getCurrentPlayer(game);

  const isSelected = isSelectedForTrade(game, square);
  const isOwnSquare = currentPlayer.id === square.ownerId;

  const nextOwnSquareIds = isOwnSquare
    ? isSelected
      ? game.phaseData.ownSquaresId.filter((i) => i !== square.id)
      : [...game.phaseData.ownSquaresId, square.id]
    : game.phaseData.ownSquaresId;

  const nextOtherSquareIds = isOwnSquare
    ? game.phaseData.other.squaresId
    : isSelected
    ? game.phaseData.other.squaresId.filter((i) => i !== square.id)
    : [...game.phaseData.other.squaresId, square.id];
  const nextOtherOwnerId = isOwnSquare
    ? game.phaseData.other.ownerId
    : nextOtherSquareIds.length > 0
    ? square.ownerId
    : undefined;

  return {
    defaultAction: {
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.cancelTrade },
      interval: longActionInterval * 1000,
    } as DefaultAction,
    phaseData: {
      other: {
        ownerId: nextOtherOwnerId,
        squaresId: nextOtherSquareIds,
      },
      ownSquaresId: nextOwnSquareIds,
    },
  };
};

export const triggerTradeSelectionToggle_play: Transition<
  GamePhase.trade_play,
  'toggleTradingSelection'
> = (game, square) => {
  return {
    ...game,
    ...triggerTradeSelectionToggle(game, square),
  };
};

export const triggerTradeSelectionToggle_rollDice: Transition<
  GamePhase.trade_rollDice,
  'toggleTradingSelection'
> = (game, square) => {
  return {
    ...game,
    ...triggerTradeSelectionToggle(game, square),
  };
};
