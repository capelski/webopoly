import {
  getCurrentPlayer,
  getNextChanceCardId,
  getNextCommunityChestCardId,
  getNextSquareId,
  getRentAmount,
  getsOutOfJail,
  isPlayerInJail,
  passesGo,
  paysRent,
} from '.';
import {
  GameEventType,
  GamePhase,
  ModalType,
  NotificationType,
  SquareType,
  TaxType,
} from '../enums';
import { EventNotification, Game, GameEvent } from '../types';

export const applyMovement = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const events: GameEvent[] = [];
  const notifications: EventNotification[] = [];

  const isInJail = isPlayerInJail(currentPlayer);
  const escapesJail = getsOutOfJail(currentPlayer, game.dice);

  if (!isInJail || escapesJail) {
    const movement = game.dice.reduce((x, y) => x + y, 0);
    const nextSquareId = getNextSquareId(game, movement);
    const nextSquare = game.squares.find((s) => s.id === nextSquareId)!;

    if (escapesJail) {
      notifications.push({
        notificationType: NotificationType.toast,
        playerId: currentPlayer.id,
        type: GameEventType.getOutOfJail,
      });
    }

    const goesToJail = nextSquare.type === SquareType.goToJail;
    if (goesToJail) {
      notifications.push({
        modalType: ModalType.okModal,
        notificationType: NotificationType.modal,
        playerId: currentPlayer.id,
        type: GameEventType.goToJail,
      });
    } else {
      const payRent = paysRent(currentPlayer, nextSquare);
      const payTaxes = nextSquare.type === SquareType.tax;
      const landsInFreeParking = nextSquare.type === SquareType.parking && game.centerPot > 0;
      const landsInChance = nextSquare.type === SquareType.chance;
      const landsInCommunityChest = nextSquare.type === SquareType.communityChest;

      if (passesGo(game, currentPlayer.squareId, nextSquareId)) {
        notifications.push({
          notificationType: NotificationType.toast,
          playerId: currentPlayer.id,
          type: GameEventType.passGo,
        });
      }

      if (payRent && nextSquare.type === SquareType.property) {
        const rent = getRentAmount(game, nextSquare, movement);

        notifications.push({
          landlordId: nextSquare.ownerId!,
          notificationType: NotificationType.toast,
          playerId: currentPlayer.id,
          rent,
          type: GameEventType.payRent,
        });
      } else if (payTaxes) {
        const tax =
          nextSquare.taxType === TaxType.income
            ? Math.min(Math.round(0.1 * currentPlayer.money), 200)
            : 100;
        notifications.push({
          notificationType: NotificationType.toast,
          playerId: currentPlayer.id,
          tax,
          type: GameEventType.payTax,
        });
      } else if (landsInFreeParking) {
        notifications.push({
          notificationType: NotificationType.toast,
          playerId: currentPlayer.id,
          pot: game.centerPot,
          type: GameEventType.freeParking,
        });
      } else if (landsInChance) {
        notifications.push({
          cardId: getNextChanceCardId(),
          modalType: ModalType.cardModal,
          notificationType: NotificationType.modal,
          playerId: currentPlayer.id,
          type: GameEventType.chance,
        });
      } else if (landsInCommunityChest) {
        notifications.push({
          cardId: getNextCommunityChestCardId(),
          modalType: ModalType.cardModal,
          notificationType: NotificationType.modal,
          playerId: currentPlayer.id,
          type: GameEventType.communityChest,
        });
      }
    }

    currentPlayer.squareId = nextSquareId;
  } else {
    const turnsInJail = currentPlayer.turnsInJail - 1;
    notifications.push({
      notificationType: NotificationType.toast,
      playerId: currentPlayer.id,
      turnsInJail,
      type: GameEventType.remainInJail,
    });
  }

  return {
    ...game,
    events: events.concat(game.events),
    gamePhase: GamePhase.play,
    notifications,
  };
};
