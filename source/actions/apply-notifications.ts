import { GameEventType, SquareType, TurnPhase } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { getCurrentPlayer } from '../logic';
import { passGoMoney } from '../parameters';
import { Game, GameEvent } from '../types';

export const applyNotifications = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const events: GameEvent[] = [];

  game.notifications.forEach((notification) => {
    switch (notification.type) {
      case GameEventType.getsOutOfJail:
        currentPlayer.turnsInJail = 0;
        break;
      case GameEventType.remainsInJail:
        currentPlayer.turnsInJail--;
        break;
      case GameEventType.goToJail:
        currentPlayer.position = game.squares.find((s) => s.type === SquareType.jail)!.position;
        currentPlayer.turnsInJail = 3;
        break;
      case GameEventType.passGo:
        currentPlayer.money += passGoMoney;
        break;
      case GameEventType.payRent:
        currentPlayer.money -= notification.rent;
        notification.landlord.money += notification.rent;
        break;
      case GameEventType.payTax:
        currentPlayer.money -= notification.tax;
        game.centerPot += notification.tax;
        break;
      case GameEventType.freeParking:
        currentPlayer.money += game.centerPot;
        game.centerPot = 0;
        break;
    }
  });

  if (currentPlayer.money < 0) {
    // TODO Allow selling/mortgaging properties
    events.unshift({
      type: GameEventType.bankruptcy,
      description: `${currentPlayer.name} goes bankrupt`,
    });
    currentPlayer.status = PlayerStatus.bankrupt;
    // TODO Select winning player if only one remaining
  }

  return {
    ...game,
    turnPhase: TurnPhase.play,
    notifications: [],
    events: [...events, ...game.notifications.reverse(), ...game.events],
  };
};
