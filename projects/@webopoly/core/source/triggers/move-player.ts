import { passGoMoney } from '../constants';
import { EventType, GamePhase, GameUpdateType, PlayerStatus, SquareType, TaxType } from '../enums';
import { doesPayRent, getCurrentPlayer, getRentAmount, passesGo } from '../logic';
import { Game, Player, Square } from '../types';
import { triggerCardPrompt_card, triggerCardPrompt_move } from './cards';
import { triggerNotifyJail } from './jail';
import { triggerPayRent, triggerPayTax } from './payments';

export type MovePlayerInputPhases = Game<GamePhase.applyCard> | Game<GamePhase.avatarAnimation>;

export type MovePlayerOutputPhases =
  | Game<GamePhase.play>
  | Game<GamePhase.buyProperty>
  | Game<GamePhase.drawCard>
  | Game<GamePhase.jailNotification>
  | Game<GamePhase.cannotPay>;

const applyFreeParking = (
  game: MovePlayerInputPhases,
  currentPlayerId: Player['id'],
): Game<GamePhase.play> => {
  return {
    ...game,
    centerPot: 0,
    defaultAction: {
      playerId: currentPlayerId,
      update: { type: GameUpdateType.endTurn },
    },
    notifications: [
      ...game.notifications,
      {
        playerId: currentPlayerId,
        pot: game.centerPot,
        type: EventType.freeParking,
      },
    ],
    phase: GamePhase.play,
    players: game.players.map((p) => {
      return p.id === currentPlayerId ? { ...p, money: p.money + game.centerPot } : p;
    }),
  };
};

const applyPassGo = (
  game: MovePlayerInputPhases,
  currentPlayerId: Player['id'],
): MovePlayerInputPhases => {
  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: currentPlayerId,
        type: EventType.passGo,
      },
    ],
    players: game.players.map((p) => {
      return p.id === currentPlayerId ? { ...p, money: p.money + passGoMoney } : p;
    }),
  };
};

export type MovePlayerOptions = {
  preventPassGo?: boolean;
};

export const triggerMovePlayer = (
  game: MovePlayerInputPhases,
  nextSquareId: Square['id'],
  options: MovePlayerOptions = {},
): MovePlayerOutputPhases => {
  const { id: currentPlayerId, squareId: currentSquareId } = getCurrentPlayer(game);
  const nextSquare = game.squares.find((s) => s.id === nextSquareId)!;

  let updatedGame: MovePlayerInputPhases = { ...game };

  if (!options.preventPassGo && passesGo(updatedGame, currentSquareId, nextSquareId)) {
    updatedGame = applyPassGo(updatedGame, currentPlayerId);
  }

  updatedGame = {
    ...updatedGame,
    players: updatedGame.players.map((p) => {
      return p.id === currentPlayerId ? { ...p, squareId: nextSquareId } : p;
    }),
  };

  const goesToJail = nextSquare.type === SquareType.goToJail;
  if (goesToJail) {
    return triggerNotifyJail(updatedGame);
  }

  const paysRent = doesPayRent(currentPlayerId, nextSquare);
  if (paysRent && nextSquare.type === SquareType.property) {
    return triggerPayRent(updatedGame, {
      landlordId: nextSquare.ownerId!,
      playerId: currentPlayerId,
      amount: getRentAmount(updatedGame, nextSquare),
      type: EventType.payRent,
    });
  }

  const payTaxes = nextSquare.type === SquareType.tax;
  if (payTaxes) {
    const tax = nextSquare.taxType === TaxType.income ? 200 : 100;
    return triggerPayTax(updatedGame, {
      amount: tax,
      playerId: currentPlayerId,
      type: EventType.payTax,
    });
  }

  const collectsFreeParking = nextSquare.type === SquareType.parking && updatedGame.centerPot > 0;
  if (collectsFreeParking) {
    return applyFreeParking(updatedGame, currentPlayerId);
  }

  const landsInSurprise = nextSquare.type === SquareType.surprise;
  if (landsInSurprise) {
    return updatedGame.phase === GamePhase.applyCard
      ? triggerCardPrompt_card(updatedGame)
      : triggerCardPrompt_move(updatedGame);
  }

  if (nextSquare.type === SquareType.property && !nextSquare.ownerId) {
    const currentPlayerIndex = updatedGame.players.findIndex((p) => p.id === currentPlayerId);

    const potentialBuyersId = updatedGame.players
      .slice(currentPlayerIndex)
      .concat(updatedGame.players.slice(0, currentPlayerIndex))
      .filter((p) => p.status === PlayerStatus.playing)
      .map((p) => p.id);
    const currentBuyerId = potentialBuyersId.shift();

    if (currentBuyerId) {
      const nextGame: Game<GamePhase.buyProperty> = {
        ...updatedGame,
        defaultAction: {
          playerId: currentBuyerId,
          update: { type: GameUpdateType.buyPropertyDecline },
        },
        phase: GamePhase.buyProperty,
        phaseData: {
          currentBuyerId,
          potentialBuyersId,
        },
      };

      return nextGame;
    }
  }

  const nextGame: Game<GamePhase.play> = {
    ...updatedGame,
    defaultAction: { playerId: currentPlayerId, update: { type: GameUpdateType.endTurn } },
    phase: GamePhase.play,
  };
  return nextGame;
};
