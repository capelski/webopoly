import { GameEventType, GamePhase, NotificationType, SquareType } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import {
  clearMortgage,
  getChanceCardById,
  getCommunityChestCardById,
  getCurrentPlayer,
  getPlayerById,
  getSquareById,
  mortgage,
} from '../logic';
import { passGoMoney } from '../parameters';
import { Game, GameEvent } from '../types';

// TODO Extract logic into separate logic files

export const applyNotifications = (game: Game, notificationType: NotificationType): Game => {
  const notifications = game.notifications.filter((n) => n.notificationType === notificationType);
  let nextGame = game;

  notifications.forEach((notification) => {
    switch (notification.type) {
      case GameEventType.buyProperty:
        const square = getSquareById(nextGame, notification.squareId);
        if (square.type === SquareType.property) {
          nextGame = {
            ...nextGame,
            players: nextGame.players.map((p) => {
              return p.id === nextGame.currentPlayerId
                ? {
                    ...p,
                    properties: p.properties.concat([notification.squareId]),
                    money: p.money - square.price,
                  }
                : p;
            }),
            squares: nextGame.squares.map((s) => {
              return s.id === square.id ? { ...s, ownerId: nextGame.currentPlayerId } : s;
            }),
          };
        }
        break;
      case GameEventType.chance:
        const chanceCard = getChanceCardById(notification.cardId);
        nextGame = chanceCard.action(nextGame);
        break;
      case GameEventType.clearMortgage:
        nextGame = clearMortgage(nextGame, notification.squareId);
        break;
      case GameEventType.communityChest:
        const communityChestCard = getCommunityChestCardById(notification.cardId);
        nextGame = communityChestCard.action(nextGame);
        break;
      case GameEventType.freeParking:
        nextGame = {
          ...nextGame,
          centerPot: 0,
          players: nextGame.players.map((p) => {
            return p.id === nextGame.currentPlayerId
              ? { ...p, money: p.money + nextGame.centerPot }
              : p;
          }),
        };
        break;
      case GameEventType.getOutOfJail:
        nextGame = {
          ...nextGame,
          players: nextGame.players.map((p) => {
            return p.id === nextGame.currentPlayerId ? { ...p, turnsInJail: 0 } : p;
          }),
        };
        break;
      case GameEventType.goToJail:
        const jailSquare = nextGame.squares.find((s) => s.type === SquareType.jail)!;
        nextGame = {
          ...nextGame,
          players: nextGame.players.map((p) => {
            return p.id === nextGame.currentPlayerId
              ? { ...p, squareId: jailSquare.id, turnsInJail: 3 }
              : p;
          }),
        };
        break;
      case GameEventType.mortgage:
        nextGame = mortgage(nextGame, notification.squareId);
        break;
      case GameEventType.passGo:
        nextGame = {
          ...nextGame,
          players: nextGame.players.map((p) => {
            return p.id === nextGame.currentPlayerId ? { ...p, money: p.money + passGoMoney } : p;
          }),
        };
        break;
      case GameEventType.payRent:
        const landlord = getPlayerById(nextGame, notification.landlordId)!;
        nextGame = {
          ...nextGame,
          players: nextGame.players.map((p) => {
            return p.id === nextGame.currentPlayerId
              ? { ...p, money: p.money - notification.rent }
              : p.id === landlord.id
              ? { ...p, money: p.money + notification.rent }
              : p;
          }),
        };
        break;
      case GameEventType.payTax:
        nextGame = {
          ...nextGame,
          centerPot: nextGame.centerPot + notification.tax,
          players: nextGame.players.map((p) => {
            return p.id === nextGame.currentPlayerId
              ? { ...p, money: p.money - notification.tax }
              : p;
          }),
        };
        break;
      case GameEventType.remainInJail:
        nextGame = {
          ...nextGame,
          players: nextGame.players.map((p) => {
            return p.id === nextGame.currentPlayerId ? { ...p, turnsInJail: p.turnsInJail - 1 } : p;
          }),
        };
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
    // TODO Allow selling/mortgaging properties

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
