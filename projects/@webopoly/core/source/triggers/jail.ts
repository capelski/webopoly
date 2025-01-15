import { jailFine, maxTurnsInJail, playerTransitionDuration } from '../constants';
import { EventType, GamePhase, GameUpdateType, JailMedium, SquareType } from '../enums';
import { exceedsMaxDoublesInARow, getCurrentPlayer } from '../logic';
import { Game, GEvent, Transition } from '../types';
import { EndTurnOutputPhases, triggerEndTurn } from './end-turn';

export const triggerGetOutOfJailCard: Transition<GamePhase.applyCard, 'applyCard'> = (game) => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    defaultAction: {
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.endTurn },
    },
    phase: GamePhase.play,
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, getOutOfJail: p.getOutOfJail + 1 } : p;
    }),
  };
};

export const triggerGoToJail = (
  game: Game<GamePhase.applyCard> | Game<GamePhase.jailNotification>,
  skipEvent = false,
): EndTurnOutputPhases => {
  const jailSquare = game.squares.find((s) => s.type === SquareType.jail)!;
  const currentPlayer = getCurrentPlayer(game);

  return triggerEndTurn({
    ...game,
    eventHistory: skipEvent
      ? game.eventHistory
      : [
          {
            playerId: currentPlayer.id,
            type: EventType.goToJail,
            tooManyDoublesInARow: exceedsMaxDoublesInARow(currentPlayer.doublesInARow),
          },
          ...game.eventHistory,
        ],
    players: game.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, squareId: jailSquare.id, isInJail: true } : p;
    }),
  });
};

export const triggerLastTurnInJail = (
  game: Game<GamePhase.diceInJailAnimation>,
): Game<GamePhase.outOfJailAnimation> => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.lastTurn);

  return {
    ...nextGame,
    defaultAction: {
      interval: playerTransitionDuration * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.endTurn },
    },
    phase: GamePhase.outOfJailAnimation,
  };
};

// Game<GamePhase.applyCard> => Go back three spaces + fall in go to jail square
// Game<GamePhase.avatarAnimation> => Fall in go to jail square
// Game<GamePhase.diceAnimation> => Too many doubles in a row
export const triggerNotifyJail = (
  game: Game<GamePhase.applyCard> | Game<GamePhase.avatarAnimation> | Game<GamePhase.diceAnimation>,
): Game<GamePhase.jailNotification> => {
  const currentPlayer = getCurrentPlayer(game);

  return {
    ...game,
    defaultAction: {
      playerId: currentPlayer.id,
      update: { type: GameUpdateType.goToJail },
    },
    phase: GamePhase.jailNotification,
  };
};

export const triggerPayJailFine = (game: Game<GamePhase.jailOptions>): EndTurnOutputPhases => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.fine);
  return triggerEndTurn(nextGame);
};

export const triggerRemainInJail = (
  game: Game<GamePhase.diceInJailAnimation>,
): EndTurnOutputPhases => {
  const currentPlayer = getCurrentPlayer(game);
  let count = 0;

  const nextPlayers = game.players.map((p) => {
    return p.id === currentPlayer.id ? { ...p, turnsInJail: (count = p.turnsInJail + 1) } : p;
  });

  return triggerEndTurn({
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: currentPlayer.id,
        turnsInJail: count,
        type: EventType.turnInJail,
      },
    ],
    players: nextPlayers,
  });
};

export const triggerRollDoublesInJail = (
  game: Game<GamePhase.diceInJailAnimation>,
): Game<GamePhase.outOfJailAnimation> => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.dice);
  return {
    ...nextGame,
    defaultAction: {
      interval: playerTransitionDuration * 1000,
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.animateAvatarOutOfJail },
    },
    phase: GamePhase.outOfJailAnimation,
  };
};

export const triggerUseJailCard: Transition<GamePhase.jailOptions, 'useJailCard'> = (game) => {
  const nextGame = updatePlayerOutOfJail(game, JailMedium.card);
  return {
    ...nextGame,
    defaultAction: {
      playerId: getCurrentPlayer(game).id,
      update: { type: GameUpdateType.rollDice },
    },
    phase: GamePhase.rollDice,
  };
};

const updatePlayerOutOfJail = <
  TGame extends Game<GamePhase.jailOptions> | Game<GamePhase.diceInJailAnimation>,
>(
  game: TGame,
  medium: JailMedium,
): TGame => {
  const currentPlayer = getCurrentPlayer(game);
  const notification: GEvent =
    medium === JailMedium.card || medium === JailMedium.dice || medium === JailMedium.fine
      ? {
          medium,
          playerId: currentPlayer.id,
          type: EventType.getOutOfJail,
        }
      : {
          playerId: currentPlayer.id,
          turnsInJail: maxTurnsInJail,
          type: EventType.turnInJail,
        };

  const nextGame: TGame = {
    ...game,
    notifications: [...game.notifications, notification],
    players: game.players.map((p) => {
      return p.id === currentPlayer.id
        ? {
            ...p,
            getOutOfJail: medium === JailMedium.card ? p.getOutOfJail - 1 : p.getOutOfJail,
            isInJail: false,
            money: medium === JailMedium.fine ? p.money - jailFine : p.money,
            turnsInJail: 0,
          }
        : p;
    }),
  };

  return nextGame;
};
