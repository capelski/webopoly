import {
  CardType,
  EventSource,
  EventType,
  GamePhase,
  PlayerStatus,
  PromptType,
  SquareType,
  TaxType,
} from '../enums';
import { doesPayRent, getCurrentPlayer, getRentAmount, passesGo } from '../logic';
import { passGoMoney } from '../parameters';
import { GamePlayPhase, GamePromptPhase, Id } from '../types';
import { triggerCardPrompt } from './cards';
import { triggerExpense, triggerPayRent } from './payments';

export type MovePlayerInputPhases = GamePlayPhase | GamePromptPhase<PromptType.card>;

export type MovePlayerOutputPhases =
  | GamePlayPhase
  | GamePromptPhase<PromptType.buyProperty>
  | GamePromptPhase<PromptType.card>
  | GamePromptPhase<PromptType.goToJail>
  | GamePromptPhase<PromptType.cannotPay>;

const applyFreeParking = (game: MovePlayerInputPhases): GamePlayPhase => {
  return {
    ...game,
    centerPot: 0,
    notifications: [
      ...game.notifications,
      {
        playerId: game.currentPlayerId,
        pot: game.centerPot,
        type: EventType.freeParking,
      },
    ],
    phase: GamePhase.play,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, money: p.money + game.centerPot } : p;
    }),
  };
};

const applyPassGo = (game: MovePlayerInputPhases): MovePlayerInputPhases => {
  return {
    ...game,
    notifications: [
      ...game.notifications,
      {
        playerId: game.currentPlayerId,
        type: EventType.passGo,
      },
    ],
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, money: p.money + passGoMoney } : p;
    }),
  };
};

export type MovePlayerOptions = {
  preventPassGo?: boolean;
};

export const triggerMovePlayer = (
  game: MovePlayerInputPhases,
  nextSquareId: Id,
  options: MovePlayerOptions = {},
): MovePlayerOutputPhases => {
  const currentSquareId = getCurrentPlayer(game).squareId;
  const nextSquare = game.squares.find((s) => s.id === nextSquareId)!;

  let updatedGame: MovePlayerInputPhases = {
    ...game,
    players: game.players.map((p) => {
      return p.id === game.currentPlayerId ? { ...p, squareId: nextSquareId } : p;
    }),
  };

  const goesToJail = nextSquare.type === SquareType.goToJail;
  if (goesToJail) {
    const nextGame: GamePromptPhase<PromptType.goToJail> = {
      ...updatedGame,
      phase: GamePhase.prompt,
      prompt: {
        type: PromptType.goToJail,
      },
    };
    return nextGame;
  }

  if (!options.preventPassGo && passesGo(updatedGame, currentSquareId, nextSquareId)) {
    updatedGame = applyPassGo(updatedGame);
  }

  const paysRent = doesPayRent(game.currentPlayerId, nextSquare);
  if (paysRent && nextSquare.type === SquareType.property) {
    return triggerPayRent(updatedGame, {
      landlordId: nextSquare.ownerId!,
      playerId: game.currentPlayerId,
      amount: getRentAmount(updatedGame, nextSquare),
      type: EventType.payRent,
    });
  }

  const payTaxes = nextSquare.type === SquareType.tax;
  if (payTaxes) {
    const currentPlayer = getCurrentPlayer(updatedGame);
    const tax =
      nextSquare.taxType === TaxType.income
        ? Math.min(Math.round(0.1 * currentPlayer.money), 200)
        : 100;
    return triggerExpense(updatedGame, {
      amount: tax,
      playerId: game.currentPlayerId,
      source: EventSource.taxSquare,
      type: EventType.expense,
    });
  }

  const collectsFreeParking = nextSquare.type === SquareType.parking && game.centerPot > 0;
  if (collectsFreeParking) {
    return applyFreeParking(updatedGame);
  }

  const landsInChance = nextSquare.type === SquareType.chance;
  if (landsInChance) {
    return triggerCardPrompt(updatedGame, CardType.chance);
  }

  const landsInCommunityChest = nextSquare.type === SquareType.communityChest;
  if (landsInCommunityChest) {
    return triggerCardPrompt(updatedGame, CardType.communityChest);
  }

  if (nextSquare.type === SquareType.property && !nextSquare.ownerId) {
    const currentPlayerIndex = updatedGame.players.findIndex(
      (p) => p.id === updatedGame.currentPlayerId,
    );

    const potentialBuyersId = updatedGame.players
      .slice(currentPlayerIndex)
      .concat(updatedGame.players.slice(0, currentPlayerIndex))
      .filter((p) => p.status === PlayerStatus.playing)
      .map((p) => p.id);
    const currentBuyerId = potentialBuyersId.shift();

    if (currentBuyerId) {
      return {
        ...updatedGame,
        phase: GamePhase.prompt,
        prompt: {
          currentBuyerId,
          potentialBuyersId,
          type: PromptType.buyProperty,
        },
      };
    }
  }

  const nextGame: GamePlayPhase = { ...updatedGame, phase: GamePhase.play };
  return nextGame;
};
