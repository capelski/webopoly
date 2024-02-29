import { EventType, GamePhase, PlayerStatus, PromptType, SquareType, TaxType } from '../enums';
import { doesPayRent, getCurrentPlayer, getRentAmount, passesGo } from '../logic';
import { passGoMoney } from '../parameters';
import { GamePlayPhase, GamePromptPhase, Id } from '../types';
import { triggerCardPrompt } from './cards';
import { triggerPayRent, triggerPayTax } from './payments';

export type MovePlayerInputPhases = GamePlayPhase | GamePromptPhase<PromptType.card>;

export type MovePlayerOutputPhases =
  | GamePlayPhase
  | GamePromptPhase<PromptType.buyProperty>
  | GamePromptPhase<PromptType.card>
  | GamePromptPhase<PromptType.goToJail>
  | GamePromptPhase<PromptType.cannotPay>;

const applyFreeParking = (game: MovePlayerInputPhases, currentPlayerId: Id): GamePlayPhase => {
  return {
    ...game,
    centerPot: 0,
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

const applyPassGo = (game: MovePlayerInputPhases, currentPlayerId: Id): MovePlayerInputPhases => {
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
  nextSquareId: Id,
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
    const nextGame: GamePromptPhase<PromptType.goToJail> = {
      ...updatedGame,
      phase: GamePhase.prompt,
      prompt: {
        type: PromptType.goToJail,
      },
    };
    return nextGame;
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
    return triggerCardPrompt(updatedGame);
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
      const nextGame: GamePromptPhase<PromptType.buyProperty> = {
        ...updatedGame,
        phase: GamePhase.prompt,
        prompt: {
          currentBuyerId,
          potentialBuyersId,
          type: PromptType.buyProperty,
        },
      };
      return nextGame;
    }
  }

  const nextGame: GamePlayPhase = { ...updatedGame, phase: GamePhase.play };
  return nextGame;
};
