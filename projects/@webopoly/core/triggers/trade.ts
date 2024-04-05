import { AnswerType, EventType, GamePhase, PromptType } from '../enums';
import { getCurrentPlayer, isSelectedForTrade } from '../logic';
import {
  GamePlayPhase,
  GamePromptPhase,
  GameRollDicePhase,
  GameTradePhase,
  PropertySquare,
} from '../types';

export const triggerAcceptTrade = (
  game: GamePromptPhase<PromptType.answerTrade>,
): GamePlayPhase | GameRollDicePhase => {
  return {
    ...game,
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
  return { ...game, phase: game.previousPhase };
};

export const triggerDeclineTrade = (
  game: GamePromptPhase<PromptType.answerTrade>,
): GamePlayPhase | GameRollDicePhase => {
  return {
    ...game,
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
    phase: GamePhase.trade,
    previousPhase: game.phase,
    other: {
      ownerId: undefined,
      squaresId: [],
    },
    ownSquaresId: [],
  };
};

export const triggerTradeOffer = (
  game: GameTradePhase,
): GamePromptPhase<PromptType.answerTrade> | GameTradePhase => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    phase: GamePhase.prompt,
    prompt: {
      playerId: currentPlayer.id,
      playerPropertiesId: game.ownSquaresId,
      previous: game.previousPhase,
      targetPlayerId: game.other.ownerId!,
      targetPropertiesId: game.other.squaresId,
      type: PromptType.answerTrade,
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
    other: {
      ownerId: nextOtherOwnerId,
      squaresId: nextOtherSquareIds,
    },
    ownSquaresId: nextOwnSquareIds,
  };
};
