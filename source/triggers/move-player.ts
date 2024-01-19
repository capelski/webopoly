import { ChangeType, PromptType, SquareType, TaxType, UiUpdateType } from '../enums';
import {
  getCurrentPlayer,
  getNextChanceCardId,
  getNextCommunityChestCardId,
  getRentAmount,
  getsOutOfJail,
  isPlayerInJail,
  passesGo,
  paysRent,
} from '../logic';
import { Change, Game, Id, UiUpdate } from '../types';

export type MovePlayerOptions = {
  preventPassGo?: boolean;
  sendToJail?: boolean;
};

export const triggerMovePlayer = (
  game: Game,
  nextSquareId: Id,
  options: MovePlayerOptions = {},
): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const changeHistory: Change[] = [];
  const uiUpdates: UiUpdate[] = [];

  const isInJail = isPlayerInJail(currentPlayer);
  const escapesJail = getsOutOfJail(currentPlayer, game.dice);

  if (!isInJail || escapesJail) {
    const nextSquare = game.squares.find((s) => s.id === nextSquareId)!;

    if (escapesJail) {
      uiUpdates.push({
        playerId: currentPlayer.id,
        type: ChangeType.getOutOfJail,
        uiUpdateType: UiUpdateType.notification,
      });
    }

    const goesToJail = options.sendToJail || nextSquare.type === SquareType.goToJail;
    if (goesToJail) {
      uiUpdates.push(
        options.sendToJail
          ? {
              playerId: currentPlayer.id,
              type: ChangeType.goToJail,
              uiUpdateType: UiUpdateType.silent,
            }
          : {
              playerId: currentPlayer.id,
              promptType: PromptType.confirmation,
              type: ChangeType.goToJail,
              uiUpdateType: UiUpdateType.prompt,
            },
      );
    } else {
      const payRent = paysRent(currentPlayer, nextSquare);
      const payTaxes = nextSquare.type === SquareType.tax;
      const landsInFreeParking = nextSquare.type === SquareType.parking && game.centerPot > 0;
      const landsInChance = nextSquare.type === SquareType.chance;
      const landsInCommunityChest = nextSquare.type === SquareType.communityChest;

      if (!options.preventPassGo && passesGo(game, currentPlayer.squareId, nextSquareId)) {
        uiUpdates.push({
          playerId: currentPlayer.id,
          type: ChangeType.passGo,
          uiUpdateType: UiUpdateType.notification,
        });
      }

      if (payRent && nextSquare.type === SquareType.property) {
        const rent = getRentAmount(game, nextSquare);

        uiUpdates.push({
          landlordId: nextSquare.ownerId!,
          playerId: currentPlayer.id,
          rent,
          type: ChangeType.payRent,
          uiUpdateType: UiUpdateType.notification,
        });
      } else if (payTaxes) {
        const tax =
          nextSquare.taxType === TaxType.income
            ? Math.min(Math.round(0.1 * currentPlayer.money), 200)
            : 100;
        uiUpdates.push({
          playerId: currentPlayer.id,
          tax,
          type: ChangeType.payTax,
          uiUpdateType: UiUpdateType.notification,
        });
      } else if (landsInFreeParking) {
        uiUpdates.push({
          playerId: currentPlayer.id,
          pot: game.centerPot,
          type: ChangeType.freeParking,
          uiUpdateType: UiUpdateType.notification,
        });
      } else if (landsInChance) {
        uiUpdates.push({
          cardId: getNextChanceCardId(),
          playerId: currentPlayer.id,
          promptType: PromptType.card,
          type: ChangeType.chance,
          uiUpdateType: UiUpdateType.prompt,
        });
      } else if (landsInCommunityChest) {
        uiUpdates.push({
          cardId: getNextCommunityChestCardId(),
          playerId: currentPlayer.id,
          promptType: PromptType.card,
          type: ChangeType.communityChest,
          uiUpdateType: UiUpdateType.prompt,
        });
      }
    }

    currentPlayer.squareId = nextSquareId;
  } else {
    const turnsInJail = currentPlayer.turnsInJail - 1;
    uiUpdates.push({
      playerId: currentPlayer.id,
      turnsInJail,
      type: ChangeType.remainInJail,
      uiUpdateType: UiUpdateType.notification,
    });
  }

  return {
    ...game,
    changeHistory: changeHistory.concat(game.changeHistory),
    uiUpdates,
  };
};
