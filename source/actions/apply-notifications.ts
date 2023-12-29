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

// TODO Use nextGame approach in all cases. Extract logic into separate logic files

export const applyNotifications = (game: Game, notificationType: NotificationType): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const events: GameEvent[] = [];
  let nextGame = game;
  const notifications = game.notifications.filter((n) => n.notificationType === notificationType);

  notifications.forEach((notification) => {
    switch (notification.type) {
      case GameEventType.buyProperty:
        const square = getSquareById(game, notification.squareId);
        if (square.type === SquareType.property) {
          game.players = game.players.map((player) => {
            return player.id === currentPlayer.id
              ? {
                  ...player,
                  properties: player.properties.concat([notification.squareId]),
                  money: player.money - square.price,
                }
              : player;
          });

          game.squares = game.squares.map((s) => {
            return s.id === square.id ? { ...s, ownerId: currentPlayer.id } : s;
          });
        }

        break;
      case GameEventType.chance:
        const chanceCard = getChanceCardById(notification.cardId);
        nextGame = chanceCard.action(game);
        break;
      case GameEventType.clearMortgage:
        nextGame = clearMortgage(nextGame, notification.squareId);
        break;
      case GameEventType.communityChest:
        const communityChestCard = getCommunityChestCardById(notification.cardId);
        nextGame = communityChestCard.action(game);
        break;
      case GameEventType.freeParking:
        currentPlayer.money += game.centerPot;
        game.centerPot = 0;
        break;
      case GameEventType.getOutOfJail:
        currentPlayer.turnsInJail = 0;
        break;
      case GameEventType.goToJail:
        const jailSquare = game.squares.find((s) => s.type === SquareType.jail)!;
        currentPlayer.squareId = jailSquare.id;
        currentPlayer.turnsInJail = 3;
        break;
      case GameEventType.mortgage:
        nextGame = mortgage(nextGame, notification.squareId);
        break;
      case GameEventType.passGo:
        currentPlayer.money += passGoMoney;
        break;
      case GameEventType.payRent:
        currentPlayer.money -= notification.rent;
        const landlord = getPlayerById(game, notification.landlordId)!;
        landlord.money += notification.rent;
        break;
      case GameEventType.payTax:
        currentPlayer.money -= notification.tax;
        game.centerPot += notification.tax;
        break;
      case GameEventType.remainInJail:
        currentPlayer.turnsInJail--;
        break;
    }
  });

  const nextNotifications =
    notificationType === NotificationType.toast
      ? nextGame.notifications.filter((n) => n.notificationType === NotificationType.modal)
      : [];
  let nextTurnPhase = nextNotifications.length > 0 ? GamePhase.modal : GamePhase.play;

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
