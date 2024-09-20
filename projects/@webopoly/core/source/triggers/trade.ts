import { longActionInterval } from '../constants';
import { AnswerType, EventType, GamePhase, GameUpdateType } from '../enums';
import { getCurrentPlayer, isSelectedForTrade } from '../logic';
import { Game_AnswerTrade, Game_Play, Game_RollDice, Game_Trade, PropertySquare } from '../types';

export const triggerAcceptTrade = (game: Game_AnswerTrade): Game_Play | Game_RollDice => {
  return {
    ...game,
    defaultAction: {
      playerId: game.phaseData.playerId,
      update:
        game.phaseData.previous === GamePhase.play
          ? { type: GameUpdateType.endTurn }
          : { type: GameUpdateType.rollDice },
    },
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
    phase: game.phaseData.previous,
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

export const triggerCancelTrade = (game: Game_Trade): Game_Play | Game_RollDice => {
  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update:
        game.phaseData.previousPhase === GamePhase.play
          ? { type: GameUpdateType.endTurn }
          : { type: GameUpdateType.rollDice },
    },
    phase: game.phaseData.previousPhase,
  };
};

export const triggerDeclineTrade = (game: Game_AnswerTrade): Game_Play | Game_RollDice => {
  return {
    ...game,
    defaultAction: {
      playerId: game.phaseData.playerId,
      update:
        game.phaseData.previous === GamePhase.play
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
    phase: game.phaseData.previous,
  };
};

export const triggerStartTrade = (game: Game_Play | Game_RollDice): Game_Trade => {
  return {
    ...game,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.cancelTrade },
      interval: longActionInterval * 1000,
    },
    phase: GamePhase.trade,
    phaseData: {
      previousPhase: game.phase,
      other: {
        ownerId: undefined,
        squaresId: [],
      },
      ownSquaresId: [],
    },
  };
};

export const triggerTradeOffer = (game: Game_Trade): Game_AnswerTrade => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    defaultAction: {
      playerId: game.phaseData.other.ownerId!,
      update: { type: GameUpdateType.declineTrade },
    },
    phase: GamePhase.answerTrade,
    phaseData: {
      playerId: currentPlayer.id,
      playerPropertiesId: game.phaseData.ownSquaresId,
      previous: game.phaseData.previousPhase,
      targetPlayerId: game.phaseData.other.ownerId!,
      targetPropertiesId: game.phaseData.other.squaresId,
    },
  };
};

export const triggerTradeSelectionToggle = (
  game: Game_Trade,
  square: PropertySquare,
): Game_Trade => {
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
    ...game,
    defaultAction: {
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.cancelTrade },
      interval: longActionInterval * 1000,
    },
    phaseData: {
      ...game.phaseData,
      other: {
        ownerId: nextOtherOwnerId,
        squaresId: nextOtherSquareIds,
      },
      ownSquaresId: nextOwnSquareIds,
    },
  };
};
