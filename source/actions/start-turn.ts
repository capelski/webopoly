import { GameEventType, SquareType, TurnPhase } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { getCurrentPlayer } from '../logic';
import { maxMovement, passGoMoney, rentPercentage } from '../parameters';
import { Game, GameEvent } from '../types';

export const startTurn = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const dice = Math.max(2, Math.round(Math.random() * maxMovement));
  const nextPosition = (currentPlayer.position + dice) % game.squares.length;
  const nextSquare = game.squares[nextPosition];
  const passesGo = nextPosition < currentPlayer.position;
  const paysRent =
    nextSquare.type === SquareType.property &&
    nextSquare.owner &&
    nextSquare.owner !== currentPlayer.name;
  const events: GameEvent[] = [
    {
      description: `${currentPlayer.name} rolls ${dice} and lands in ${nextSquare.name}`,
      type: GameEventType.startTurn,
    },
  ];

  currentPlayer.position = nextPosition;

  if (passesGo) {
    events.unshift({
      type: GameEventType.passGo,
      description: `${currentPlayer.name} passes GO and gets $${passGoMoney}`,
    });
    currentPlayer.money += passGoMoney;
  }

  if (paysRent) {
    const rent = nextSquare.price * rentPercentage;
    events.unshift({
      type: GameEventType.payRent,
      description: `${currentPlayer.name} pays $${rent} rent to ${nextSquare.owner}`,
    });
    currentPlayer.money -= rent;
    game.players.find((p) => p.name === nextSquare.owner)!.money += rent;

    if (currentPlayer.money < 0) {
      // TODO Allow selling/mortgaging properties
      events.unshift({
        type: GameEventType.bankruptcy,
        description: `${currentPlayer.name} goes bankrupt`,
      });
      currentPlayer.status = PlayerStatus.bankrupt;
      // TODO Select winning player if only one remaining
    }
  }

  return {
    ...game,
    dice,
    turnPhase: TurnPhase.play,
    events: events.concat(game.events),
  };
};
