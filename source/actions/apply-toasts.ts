import { GameEventType, GamePhase, SquareType } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { clearMortgage, getCurrentPlayer, getPlayerById, getSquareById, mortgage } from '../logic';
import { passGoMoney } from '../parameters';
import { Game, GameEvent } from '../types';

// TODO Use nextGame approach in all cases. Extract logic into separate logic files

export const applyToasts = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const events: GameEvent[] = [];
  let nextGame = game;

  game.toasts.forEach((toast) => {
    switch (toast.type) {
      case GameEventType.buyProperty:
        const square = getSquareById(game, toast.squareId);
        if (square.type === SquareType.property) {
          game.players = game.players.map((player) => {
            return player.id === currentPlayer.id
              ? {
                  ...player,
                  properties: player.properties.concat([toast.squareId]),
                  money: player.money - square.price,
                }
              : player;
          });

          game.squares = game.squares.map((s) => {
            return s.id === square.id ? { ...s, ownerId: currentPlayer.id } : s;
          });
        }

        break;
      case GameEventType.clearMortgage:
        nextGame = clearMortgage(nextGame, toast.squareId);
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
        nextGame = mortgage(nextGame, toast.squareId);
        break;
      case GameEventType.passGo:
        currentPlayer.money += passGoMoney;
        break;
      case GameEventType.payRent:
        currentPlayer.money -= toast.rent;
        const landlord = getPlayerById(game, toast.landlordId)!;
        landlord.money += toast.rent;
        break;
      case GameEventType.payTax:
        currentPlayer.money -= toast.tax;
        game.centerPot += toast.tax;
        break;
      case GameEventType.remainInJail:
        currentPlayer.turnsInJail--;
        break;
    }
  });

  let nextTurnPhase: GamePhase = nextGame.modals.length > 0 ? GamePhase.modal : GamePhase.play;
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
    events: [...events, ...nextGame.toasts.reverse(), ...nextGame.events],
    gamePhase: nextTurnPhase,
    toasts: [],
  };
};
