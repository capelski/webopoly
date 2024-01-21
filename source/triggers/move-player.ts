import { ChangeType, PromptType, SquareType, TaxType, UiUpdateType } from '../enums';
import {
  collectCenterPot,
  doesPayRent,
  getCurrentPlayer,
  getNextChanceCardId,
  getNextCommunityChestCardId,
  getOutOfJail,
  getRentAmount,
  getsOutOfJail,
  isPlayerInJail,
  passesGo,
  passGo,
  payRent,
  payTax,
  remainInJail,
} from '../logic';
import { Game, Id, UiUpdate } from '../types';

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
  const uiUpdates: UiUpdate[] = [];

  const isInJail = isPlayerInJail(currentPlayer);
  const escapesJail = getsOutOfJail(currentPlayer, nextGame.dice);

  if (!isInJail || escapesJail) {
    const nextSquare = nextGame.squares.find((s) => s.id === nextSquareId)!;

    if (escapesJail) {
      nextGame = getOutOfJail(nextGame);
      currentPlayer = getCurrentPlayer(nextGame);
      uiUpdates.push({
        playerId: nextGame.currentPlayerId,
        type: ChangeType.getOutOfJail,
        uiUpdateType: UiUpdateType.notification,
      });
    }

    const goesToJail = nextSquare.type === SquareType.goToJail;
    if (goesToJail) {
      uiUpdates.push({
        playerId: nextGame.currentPlayerId,
        promptType: PromptType.confirmation,
        type: ChangeType.goToJail,
        uiUpdateType: UiUpdateType.prompt,
      });
    } else {
      const paysRent = doesPayRent(currentPlayer, nextSquare);
      const payTaxes = nextSquare.type === SquareType.tax;
      const collectsFreeParking = nextSquare.type === SquareType.parking && game.centerPot > 0;
      const landsInChance = nextSquare.type === SquareType.chance;
      const landsInCommunityChest = nextSquare.type === SquareType.communityChest;

      if (!options.preventPassGo && passesGo(nextGame, currentPlayer.squareId, nextSquareId)) {
        nextGame = passGo(nextGame);
        currentPlayer = getCurrentPlayer(nextGame);
        uiUpdates.push({
          playerId: nextGame.currentPlayerId,
          type: ChangeType.passGo,
          uiUpdateType: UiUpdateType.notification,
        });
      }

      if (paysRent && nextSquare.type === SquareType.property) {
        const rent = getRentAmount(nextGame, nextSquare);
        nextGame = payRent(nextGame, nextSquare.ownerId!, rent);
        currentPlayer = getCurrentPlayer(nextGame);

        uiUpdates.push({
          landlordId: nextSquare.ownerId!,
          playerId: nextGame.currentPlayerId,
          rent,
          type: ChangeType.payRent,
          uiUpdateType: UiUpdateType.notification,
        });
      } else if (payTaxes) {
        const tax =
          nextSquare.taxType === TaxType.income
            ? Math.min(Math.round(0.1 * currentPlayer.money), 200)
            : 100;
        nextGame = payTax(nextGame, tax);
        currentPlayer = getCurrentPlayer(nextGame);
        uiUpdates.push({
          playerId: nextGame.currentPlayerId,
          tax,
          type: ChangeType.payTax,
          uiUpdateType: UiUpdateType.notification,
        });
      } else if (collectsFreeParking) {
        nextGame = collectCenterPot(nextGame);
        currentPlayer = getCurrentPlayer(nextGame);
        uiUpdates.push({
          playerId: nextGame.currentPlayerId,
          pot: game.centerPot,
          type: ChangeType.freeParking,
          uiUpdateType: UiUpdateType.notification,
        });
      } else if (landsInChance) {
        uiUpdates.push({
          cardId: getNextChanceCardId(),
          playerId: nextGame.currentPlayerId,
          promptType: PromptType.card,
          type: ChangeType.chance,
          uiUpdateType: UiUpdateType.prompt,
        });
      } else if (landsInCommunityChest) {
        uiUpdates.push({
          cardId: getNextCommunityChestCardId(),
          playerId: nextGame.currentPlayerId,
          promptType: PromptType.card,
          type: ChangeType.communityChest,
          uiUpdateType: UiUpdateType.prompt,
        });
      }
    }

    nextGame = {
      ...nextGame,
      players: nextGame.players.map((p) => {
        return p.id === currentPlayer.id ? { ...p, squareId: nextSquareId } : p;
      }),
    };
  } else {
    nextGame = remainInJail(nextGame);
    currentPlayer = getCurrentPlayer(nextGame);
    uiUpdates.push({
      playerId: nextGame.currentPlayerId,
      turnsInJail: currentPlayer.turnsInJail,
      type: ChangeType.remainInJail,
      uiUpdateType: UiUpdateType.notification,
    });
  }

  return { ...nextGame, uiUpdates };
};
