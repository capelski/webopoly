import { NotificationType, PromptType, SquareType, TaxType } from '../enums';
import {
  collectCenterPot,
  doesPayRent,
  getCurrentPlayer,
  getNextChanceCardId,
  getNextCommunityChestCardId,
  getRentAmount,
  passesGo,
  passGo,
  payRent,
  payTax,
} from '../logic';
import { Game, Id, Notification } from '../types';

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
  const notifications: Notification[] = [];
  const nextSquare = nextGame.squares.find((s) => s.id === nextSquareId)!;

  const goesToJail = nextSquare.type === SquareType.goToJail;
  if (goesToJail) {
    nextGame.prompt = {
      type: PromptType.goToJail,
    };
  } else {
    const paysRent = doesPayRent(currentPlayer, nextSquare);
    const payTaxes = nextSquare.type === SquareType.tax;
    const collectsFreeParking = nextSquare.type === SquareType.parking && game.centerPot > 0;
    const landsInChance = nextSquare.type === SquareType.chance;
    const landsInCommunityChest = nextSquare.type === SquareType.communityChest;

    if (!options.preventPassGo && passesGo(nextGame, currentPlayer.squareId, nextSquareId)) {
      nextGame = passGo(nextGame);
      currentPlayer = getCurrentPlayer(nextGame);
      notifications.push({
        playerId: nextGame.currentPlayerId,
        type: NotificationType.passGo,
      });
    }

    if (paysRent && nextSquare.type === SquareType.property) {
      const rent = getRentAmount(nextGame, nextSquare);
      nextGame = payRent(nextGame, nextSquare.ownerId!, rent);
      currentPlayer = getCurrentPlayer(nextGame);

      notifications.push({
        landlordId: nextSquare.ownerId!,
        playerId: nextGame.currentPlayerId,
        rent,
        type: NotificationType.payRent,
      });
    } else if (payTaxes) {
      const tax =
        nextSquare.taxType === TaxType.income
          ? Math.min(Math.round(0.1 * currentPlayer.money), 200)
          : 100;
      nextGame = payTax(nextGame, tax);
      currentPlayer = getCurrentPlayer(nextGame);
      notifications.push({
        playerId: nextGame.currentPlayerId,
        tax,
        type: NotificationType.payTax,
      });
    } else if (collectsFreeParking) {
      nextGame = collectCenterPot(nextGame);
      currentPlayer = getCurrentPlayer(nextGame);
      notifications.push({
        playerId: nextGame.currentPlayerId,
        pot: game.centerPot,
        type: NotificationType.freeParking,
      });
    } else if (landsInChance) {
      nextGame.prompt = {
        cardId: getNextChanceCardId(),
        cardType: 'chance',
        type: PromptType.card,
      };
    } else if (landsInCommunityChest) {
      nextGame.prompt = {
        cardId: getNextCommunityChestCardId(),
        cardType: 'community',
        type: PromptType.card,
      };
    }
  }

  nextGame = {
    ...nextGame,
    players: nextGame.players.map((p) => {
      return p.id === currentPlayer.id ? { ...p, squareId: nextSquareId } : p;
    }),
  };

  return { ...nextGame, notifications };
};
