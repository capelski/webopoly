import { ChangeType, ChangeUiType, ModalType, SquareType, TaxType } from '../enums';
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
import { Change, Game, Id, IncomingChange } from '../types';

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
  const incomingChanges: IncomingChange[] = [];

  const isInJail = isPlayerInJail(currentPlayer);
  const escapesJail = getsOutOfJail(currentPlayer, game.dice);

  if (!isInJail || escapesJail) {
    const nextSquare = game.squares.find((s) => s.id === nextSquareId)!;

    if (escapesJail) {
      incomingChanges.push({
        playerId: currentPlayer.id,
        type: ChangeType.getOutOfJail,
        uiType: ChangeUiType.toast,
      });
    }

    const goesToJail = options.sendToJail || nextSquare.type === SquareType.goToJail;
    if (goesToJail) {
      incomingChanges.push({
        modalType: ModalType.okModal,
        playerId: currentPlayer.id,
        type: ChangeType.goToJail,
        uiType: options.sendToJail ? ChangeUiType.silent : ChangeUiType.modal,
      });
    } else {
      const payRent = paysRent(currentPlayer, nextSquare);
      const payTaxes = nextSquare.type === SquareType.tax;
      const landsInFreeParking = nextSquare.type === SquareType.parking && game.centerPot > 0;
      const landsInChance = nextSquare.type === SquareType.chance;
      const landsInCommunityChest = nextSquare.type === SquareType.communityChest;

      if (!options.preventPassGo && passesGo(game, currentPlayer.squareId, nextSquareId)) {
        incomingChanges.push({
          playerId: currentPlayer.id,
          type: ChangeType.passGo,
          uiType: ChangeUiType.toast,
        });
      }

      if (payRent && nextSquare.type === SquareType.property) {
        const rent = getRentAmount(game, nextSquare);

        incomingChanges.push({
          landlordId: nextSquare.ownerId!,
          playerId: currentPlayer.id,
          rent,
          type: ChangeType.payRent,
          uiType: ChangeUiType.toast,
        });
      } else if (payTaxes) {
        const tax =
          nextSquare.taxType === TaxType.income
            ? Math.min(Math.round(0.1 * currentPlayer.money), 200)
            : 100;
        incomingChanges.push({
          playerId: currentPlayer.id,
          tax,
          type: ChangeType.payTax,
          uiType: ChangeUiType.toast,
        });
      } else if (landsInFreeParking) {
        incomingChanges.push({
          playerId: currentPlayer.id,
          pot: game.centerPot,
          type: ChangeType.freeParking,
          uiType: ChangeUiType.toast,
        });
      } else if (landsInChance) {
        incomingChanges.push({
          cardId: getNextChanceCardId(),
          modalType: ModalType.cardModal,
          playerId: currentPlayer.id,
          type: ChangeType.chance,
          uiType: ChangeUiType.modal,
        });
      } else if (landsInCommunityChest) {
        incomingChanges.push({
          cardId: getNextCommunityChestCardId(),
          modalType: ModalType.cardModal,
          playerId: currentPlayer.id,
          type: ChangeType.communityChest,
          uiType: ChangeUiType.modal,
        });
      }
    }

    currentPlayer.squareId = nextSquareId;
  } else {
    const turnsInJail = currentPlayer.turnsInJail - 1;
    incomingChanges.push({
      playerId: currentPlayer.id,
      turnsInJail,
      type: ChangeType.remainInJail,
      uiType: ChangeUiType.toast,
    });
  }

  return {
    ...game,
    changeHistory: changeHistory.concat(game.changeHistory),
    incomingChanges,
  };
};
