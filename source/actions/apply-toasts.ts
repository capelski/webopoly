import { GameEventType, GamePhase, SquareType } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { getCurrentPlayer, getPlayerById, getSquareById, toPropertySquare } from '../logic';
import { passGoMoney } from '../parameters';
import { Game, GameEvent } from '../types';

export const applyToasts = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const events: GameEvent[] = [];

  game.toasts.forEach((toast) => {
    switch (toast.type) {
      case GameEventType.buyProperty:
        const square = getSquareById(game, toast.squareId);
        const propertySquare = toPropertySquare(square);

        game.players = game.players.map((player) => {
          return player === currentPlayer && propertySquare
            ? {
                ...player,
                properties: player.properties.concat([toast.squareId]),
                money: player.money - propertySquare.price,
              }
            : player;
        });

        game.squares = game.squares.map((square) => {
          return square === propertySquare ? { ...square, ownerId: currentPlayer.id } : square;
        });

        break;
      case GameEventType.getOutOfJail:
        currentPlayer.turnsInJail = 0;
        break;
      case GameEventType.remainInJail:
        currentPlayer.turnsInJail--;
        break;
      case GameEventType.goToJail:
        const jailSquare = game.squares.find((s) => s.type === SquareType.jail)!;
        currentPlayer.squareId = jailSquare.id;
        currentPlayer.turnsInJail = 3;
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
      case GameEventType.freeParking:
        currentPlayer.money += game.centerPot;
        game.centerPot = 0;
        break;
    }
  });

  let nextTurnPhase: GamePhase = game.modals.length > 0 ? GamePhase.modal : GamePhase.play;
  if (currentPlayer.money < 0) {
    // TODO Allow selling/mortgaging properties

    events.unshift({
      playerId: currentPlayer.id,
      type: GameEventType.bankruptcy,
    });
    currentPlayer.status = PlayerStatus.bankrupt;

    const remainingPlayers = game.players.filter((p) => p.status === PlayerStatus.playing);
    if (remainingPlayers.length === 1) {
      nextTurnPhase = GamePhase.finished;
      events.unshift({
        playerId: currentPlayer.id,
        type: GameEventType.playerWin,
      });
    }
  }

  return {
    ...game,
    events: [...events, ...game.toasts.reverse(), ...game.events],
    gamePhase: nextTurnPhase,
    toasts: [],
  };
};
