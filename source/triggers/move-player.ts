import {
  CardType,
  NotificationSource,
  NotificationType,
  PromptType,
  SquareType,
  TaxType,
} from '../enums';
import { doesPayRent, getCurrentPlayer, getRentAmount, passesGo } from '../logic';
import { passGoMoney } from '../parameters';
import { ExpenseNotification, Game, Id } from '../types';
import { triggerCardPrompt } from './cards';
import { triggerExpense, triggerPayRent } from './payments';

export type MovePlayerOptions = {
  preventPassGo?: boolean;
};

export const triggerMovePlayer = (
  game: Game,
  nextSquareId: Id,
  options: MovePlayerOptions = {},
): Game => {
  let nextGame: Game = { ...game };
  let currentPlayer = getCurrentPlayer(nextGame);
  const nextSquare = nextGame.squares.find((s) => s.id === nextSquareId)!;

  const goesToJail = nextSquare.type === SquareType.goToJail;
  if (goesToJail) {
    nextGame.status = {
      type: PromptType.goToJail,
    };
  } else {
    const paysRent = doesPayRent(currentPlayer, nextSquare);
    const payTaxes = nextSquare.type === SquareType.tax;
    const collectsFreeParking = nextSquare.type === SquareType.parking && game.centerPot > 0;
    const landsInChance = nextSquare.type === SquareType.chance;
    const landsInCommunityChest = nextSquare.type === SquareType.communityChest;

    if (!options.preventPassGo && passesGo(nextGame, currentPlayer.squareId, nextSquareId)) {
      nextGame = applyPassGo(nextGame);
      currentPlayer = getCurrentPlayer(nextGame);
    }

    if (paysRent && nextSquare.type === SquareType.property) {
      nextGame = triggerPayRent(nextGame, {
        landlordId: nextSquare.ownerId!,
        playerId: game.currentPlayerId,
        amount: getRentAmount(nextGame, nextSquare),
        type: NotificationType.payRent,
      });
      currentPlayer = getCurrentPlayer(nextGame);
    } else if (payTaxes) {
      const tax =
        nextSquare.taxType === TaxType.income
          ? Math.min(Math.round(0.1 * currentPlayer.money), 200)
          : 100;
      const taxNotification: ExpenseNotification = {
        amount: tax,
        playerId: game.currentPlayerId,
        source: NotificationSource.taxSquare,
        type: NotificationType.expense,
      };
      nextGame = triggerExpense(nextGame, taxNotification);
      currentPlayer = getCurrentPlayer(nextGame);
    } else if (collectsFreeParking) {
      nextGame = applyFreeParking(nextGame);
      currentPlayer = getCurrentPlayer(nextGame);
    } else if (landsInChance) {
      nextGame = triggerCardPrompt(nextGame, CardType.chance);
    } else if (landsInCommunityChest) {
      nextGame = triggerCardPrompt(nextGame, CardType.communityChest);
    }
  }

  nextGame = {
    ...nextGame,
    players: nextGame.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, squareId: nextSquareId } : p;
    }),
  };

  return nextGame;
};

const applyFreeParking = (game: Game): Game => {
  return {
    ...game,
    centerPot: 0,
    notifications: [
      ...game.notifications,
      {
        playerId: game.currentPlayerId,
        pot: game.centerPot,
        type: NotificationType.freeParking,
      },
    ],
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, money: p.money + game.centerPot } : p;
    }),
  };
};

const applyPassGo = (game: Game): Game => {
  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: game.currentPlayerId,
        type: NotificationType.passGo,
      },
    ],
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, money: p.money + passGoMoney } : p;
    }),
  };
};
