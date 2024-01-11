import { GameEventType, GamePhase, NotificationType } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import {
  buildHouse,
  buyProperty,
  clearMortgage,
  collectCenterPot,
  endTurn,
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
  sellHouse,
} from '../logic';
import { Game, GameEvent } from '../types';
import { applyMovement } from './movement';

type Transformer<T = GameEventType> = (game: Game, notification: GameEvent & { type: T }) => Game;

const transformersMap: { [TKey in GameEventType]: Transformer<TKey> } = {
  [GameEventType.bankruptcy]: (game) => game, // Not addressed here
  [GameEventType.buildHouse]: (game, notification) => buildHouse(game, notification.propertyId),
  [GameEventType.buyProperty]: (game, notification) => buyProperty(game, notification.propertyId),
  [GameEventType.chance]: (game, notification) => {
    const card = getChanceCardById(notification.cardId);
    return card.action(game);
  },
  [GameEventType.clearMortgage]: (game, notification) =>
    clearMortgage(game, notification.propertyId),
  [GameEventType.communityChest]: (game, notification) => {
    const card = getCommunityChestCardById(notification.cardId);
    return card.action(game);
  },
  [GameEventType.endTurn]: (game) => endTurn(game),
  [GameEventType.freeParking]: (game) => collectCenterPot(game),
  [GameEventType.getOutOfJail]: (game) => getOutOfJail(game),
  [GameEventType.goToJail]: (game) => goToJail(game),
  [GameEventType.mortgage]: (game, notification) => mortgage(game, notification.propertyId),
  [GameEventType.passGo]: (game) => passGo(game),
  [GameEventType.payRent]: (game, notification) =>
    payRent(game, notification.landlordId, notification.rent),
  [GameEventType.payTax]: (game, notification) => payTax(game, notification.tax),
  [GameEventType.playerWin]: (game) => game, // Not addressed here
  [GameEventType.remainInJail]: (game) => remainInJail(game),
  [GameEventType.rollDice]: (game) => applyMovement(game),
  [GameEventType.sellHouse]: (game, notification) => sellHouse(game, notification.propertyId),
};

export const applyNotifications = (game: Game, notificationType: NotificationType): Game => {
  const notifications = game.notifications.filter((n) => n.notificationType === notificationType);
  let nextGame = game;

  notifications.forEach((notification) => {
    const transformer: Transformer = transformersMap[notification.type];
    nextGame = transformer(nextGame, notification);
  });

  const events: GameEvent[] = [];
  const nextNotifications =
    notificationType === NotificationType.silent
      ? nextGame.notifications.filter((n) => n.notificationType !== NotificationType.silent)
      : notificationType === NotificationType.toast
      ? nextGame.notifications.filter((n) => n.notificationType === NotificationType.modal)
      : [];
  let nextTurnPhase = game.gamePhase !== nextGame.gamePhase ? nextGame.gamePhase : GamePhase.play;
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
    events: [
      ...events,
      ...notifications.filter((n) => n.notificationType !== NotificationType.silent).reverse(),
      ...nextGame.events,
    ],
    gamePhase: nextTurnPhase,
    notifications: nextNotifications,
  };
};
