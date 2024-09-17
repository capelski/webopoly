import { longActionInterval } from '../constants';
import { AnswerType, EventType, GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer, isSelectedForTrade } from '../logic';
import {
  GameAnswerTradePhase,
  GamePlayPhase,
  GameRollDicePhase,
  GameTradePhase,
  PropertySquare,
} from '../types';

export const triggerAcceptTrade = (
  game: GameAnswerTradePhase,
): GamePlayPhase | GameRollDicePhase => {
  return {
    ...game,
    defaultAction: {
      playerId: game.prompt.playerId,
      update:
        game.prompt.previous === GamePhase.play
          ? { type: GameUpdateType.endTurn }
          : { type: GameUpdateType.rollDice },
    },
    notifications: [
      ...game.notifications,
      {
        answer: AnswerType.accept,
        playerId: game.prompt.playerId,
        playerPropertiesId: game.prompt.playerPropertiesId,
        targetPlayerId: game.prompt.targetPlayerId,
        targetPropertiesId: game.prompt.targetPropertiesId,
        type: EventType.answerTrade,
      },
    ],
    phase: game.prompt.previous,
    players: game.players.map((player) => {
      return player.id === game.prompt.playerId
        ? {
            ...player,
            properties: player.properties
              .filter((squareId) => !game.prompt.playerPropertiesId.includes(squareId))
              .concat(game.prompt.targetPropertiesId),
          }
        : player.id === game.prompt.targetPlayerId
        ? {
            ...player,
            properties: player.properties
              .filter((squareId) => !game.prompt.targetPropertiesId.includes(squareId))
              .concat(game.prompt.playerPropertiesId),
          }
        : player;
    }),
    squares: game.squares.map((square) => {
      return game.prompt.playerPropertiesId.includes(square.id)
        ? { ...square, ownerId: game.prompt.targetPlayerId }
        : game.prompt.targetPropertiesId.includes(square.id)
        ? { ...square, ownerId: game.prompt.playerId }
        : square;
    }),
  };
};

export const triggerCancelTrade = (game: GameTradePhase): GamePlayPhase | GameRollDicePhase => {
  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update:
        game.previousPhase === GamePhase.play
          ? { type: GameUpdateType.endTurn }
          : { type: GameUpdateType.rollDice },
    },
    phase: game.previousPhase,
  };
};

export const triggerDeclineTrade = (
  game: GameAnswerTradePhase,
): GamePlayPhase | GameRollDicePhase => {
  return {
    ...game,
    defaultAction: {
      playerId: game.prompt.playerId,
      update:
        game.prompt.previous === GamePhase.play
          ? { type: GameUpdateType.endTurn }
          : { type: GameUpdateType.rollDice },
    },
    notifications: [
      ...game.notifications,
      {
        answer: AnswerType.decline,
        playerId: game.prompt.playerId,
        playerPropertiesId: game.prompt.playerPropertiesId,
        targetPlayerId: game.prompt.targetPlayerId,
        targetPropertiesId: game.prompt.targetPropertiesId,
        type: EventType.answerTrade,
      },
    ],
    phase: game.prompt.previous,
  };
};

export const triggerStartTrade = (game: GamePlayPhase | GameRollDicePhase): GameTradePhase => {
  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.cancelTrade },
      interval: longActionInterval * 1000,
    },
    phase: GamePhase.trade,
    previousPhase: game.phase,
    other: {
      ownerId: undefined,
      squaresId: [],
    },
    ownSquaresId: [],
  };
};

export const triggerTradeOffer = (game: GameTradePhase): GameAnswerTradePhase => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    defaultAction: {
      playerId: game.other.ownerId!,
      update: { type: GameUpdateType.declineTrade },
    },
    phase: GamePhase.answerTrade,
    prompt: {
      playerId: currentPlayer.id,
      playerPropertiesId: game.ownSquaresId,
      previous: game.previousPhase,
      targetPlayerId: game.other.ownerId!,
      targetPropertiesId: game.other.squaresId,
    },
  };
};

export const triggerTradeSelectionToggle = (
  game: GameTradePhase,
  square: PropertySquare,
): GameTradePhase => {
  const currentPlayer = getCurrentPlayer(game);

  const isSelected = isSelectedForTrade(game, square);
  const isOwnSquare = currentPlayer.id === square.ownerId;

  const nextOwnSquareIds = isOwnSquare
    ? isSelected
      ? game.ownSquaresId.filter((i) => i !== square.id)
      : [...game.ownSquaresId, square.id]
    : game.ownSquaresId;

  const nextOtherSquareIds = isOwnSquare
    ? game.other.squaresId
    : isSelected
    ? game.other.squaresId.filter((i) => i !== square.id)
    : [...game.other.squaresId, square.id];
  const nextOtherOwnerId = isOwnSquare
    ? game.other.ownerId
    : nextOtherSquareIds.length > 0
    ? square.ownerId
    : undefined;

  return {
    ...game,
    defaultAction: {
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.cancelTrade },
      interval: longActionInterval * 1000,
    },
    other: {
      ownerId: nextOtherOwnerId,
      squaresId: nextOtherSquareIds,
    },
    ownSquaresId: nextOwnSquareIds,
  };
};
