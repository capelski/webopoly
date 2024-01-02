import { GameEventType, GamePhase, NotificationType } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import {
  buyProperty,
  clearMortgage,
  collectCenterPot,
  getChanceCardById,
  getCommunityChestCardById,
  getCurrentPlayer,
  getOutOfJail,
  goToJail,
  mortgage,
  passGo,
  payRent,
  payTax,
  remainInJail,
} from '../logic';
import { Game, GameEvent } from '../types';

export const applyNotifications = (game: Game, notificationType: NotificationType): Game => {
  const notifications = game.notifications.filter((n) => n.notificationType === notificationType);
  let nextGame = game;

  notifications.forEach((notification) => {
    switch (notification.type) {
      case GameEventType.buyProperty:
        nextGame = buyProperty(nextGame, notification.propertyId);
        break;
      case GameEventType.chance:
        const chanceCard = getChanceCardById(notification.cardId);
        nextGame = chanceCard.action(nextGame);
        break;
      case GameEventType.clearMortgage:
        nextGame = clearMortgage(nextGame, notification.propertyId);
        break;
      case GameEventType.communityChest:
        const communityChestCard = getCommunityChestCardById(notification.cardId);
        nextGame = communityChestCard.action(nextGame);
        break;
      case GameEventType.freeParking:
        nextGame = collectCenterPot(nextGame);
        break;
      case GameEventType.getOutOfJail:
        nextGame = getOutOfJail(nextGame);
        break;
      case GameEventType.goToJail:
        nextGame = goToJail(nextGame);
        break;
      case GameEventType.mortgage:
        nextGame = mortgage(nextGame, notification.propertyId);
        break;
      case GameEventType.passGo:
        nextGame = passGo(nextGame);
        break;
      case GameEventType.payRent:
        nextGame = payRent(nextGame, notification.landlordId, notification.rent);
        break;
      case GameEventType.payTax:
        nextGame = payTax(nextGame, notification.tax);
        break;
      case GameEventType.remainInJail:
        nextGame = remainInJail(nextGame);
        break;
    }
  });

  const events: GameEvent[] = [];
  const nextNotifications =
    notificationType === NotificationType.toast
      ? nextGame.notifications.filter((n) => n.notificationType === NotificationType.modal)
      : [];
  let nextTurnPhase = GamePhase.play;
  const currentPlayer = getCurrentPlayer(nextGame);

  if (currentPlayer.money < 0) {
    events.unshift({
      playerId: currentPlayer.id,
      type: GameEventType.bankruptcy,
    });
    currentPlayer.status = PlayerStatus.bankrupt;

    const remainingPlayers = nextGame.players.filter((p) => p.status === PlayerStatus.playing);
    if (remainingPlayers.length === 1) {
      nextTurnPhase = GamePhase.finished;
      events.unshift({
        playerId: currentPlayer.id,
        type: GameEventType.playerWin,
      });
    }
  }

  return {
    ...nextGame,
    events: [...events, ...notifications.reverse(), ...nextGame.events],
    gamePhase: nextTurnPhase,
    notifications: nextNotifications,
  };
};
