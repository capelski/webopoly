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
  getNextSquareId,
  getOutOfJail,
  goToJail,
  mortgage,
  passGo,
  payRent,
  payTax,
  remainInJail,
  sellHouse,
} from '../logic';
import { triggerMovePlayer } from '../triggers';
import { EventNotification, Game, GameEvent, SplitNotifications } from '../types';

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
  [GameEventType.rollDice]: (game) => {
    const movement = game.dice.reduce((x, y) => x + y, 0);
    const nextSquareId = getNextSquareId(game, movement);
    return triggerMovePlayer(game, nextSquareId);
  },
  [GameEventType.sellHouse]: (game, notification) => sellHouse(game, notification.propertyId),
};

export const applyNotifications = (game: Game, notificationType: NotificationType): Game => {
  const { currentNotifications, pendingNotifications } = splitNotifications(
    game.notifications,
    notificationType,
  );
  const newNotifications: EventNotification[] = [];

  let nextGame = game;

  currentNotifications.forEach((notification) => {
    const transformer: Transformer = transformersMap[notification.type];
    const { notifications, ...rest } = transformer(nextGame, notification);
    nextGame = { ...rest, notifications: [] };
    newNotifications.push(...notifications.filter((n) => !game.notifications.includes(n)));
  });

  const events: GameEvent[] = [];
  let nextGamePhase = nextGame.gamePhase;
  const currentPlayer = getCurrentPlayer(nextGame);

  if (currentPlayer.money < 0) {
    events.unshift({
      playerId: currentPlayer.id,
      type: GameEventType.bankruptcy,
    });
    currentPlayer.status = PlayerStatus.bankrupt;

    const remainingPlayers = nextGame.players.filter((p) => p.status === PlayerStatus.playing);
    if (remainingPlayers.length === 1) {
      nextGamePhase = GamePhase.finished;
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
      ...currentNotifications
        .filter((n) => n.notificationType !== NotificationType.silent)
        .reverse(),
      ...nextGame.events,
    ],
    gamePhase: nextGamePhase,
    notifications: pendingNotifications.concat(newNotifications),
  };
};

const splitNotifications = (
  notifications: EventNotification[],
  notificationType: NotificationType,
): SplitNotifications => {
  return notifications.reduce<SplitNotifications>(
    (reduced, n) => {
      if (n.notificationType === notificationType) {
        reduced.currentNotifications.push(n);
      } else {
        reduced.pendingNotifications.push(n);
      }
      return reduced;
    },
    {
      currentNotifications: [],
      pendingNotifications: [],
    },
  );
};
