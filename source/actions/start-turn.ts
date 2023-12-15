import { GameEventType, SquareType, TurnPhase } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { getCurrentPlayer } from '../logic';
import { maxMovement, passGoMoney, rentPercentage } from '../parameters';
import { Game, GameEvent } from '../types';

// TODO Fetch player name instead of fabricating it from index game.currentPlayer + 1

export const startTurn = (game: Game): Game => {
  const squaresMovement = Math.max(2, Math.round(Math.random() * maxMovement));
  const currentPlayer = getCurrentPlayer(game);
  const nextPosition = (currentPlayer.position + squaresMovement) % game.squares.length;
  const nextSquare = game.squares[nextPosition];
  const passesGo = nextPosition < currentPlayer.position;
  currentPlayer.position = nextPosition;
  const paysRent =
    nextSquare.type === SquareType.property &&
    nextSquare.owner &&
    nextSquare.owner !== currentPlayer.name;
  const events: GameEvent[] = [
    {
      description: `Player ${game.currentPlayer + 1} rolls ${squaresMovement} and lands in ${
        game.squares[nextPosition].name
      }`,
      type: GameEventType.startTurn,
    },
  ];

  if (passesGo) {
    events.unshift({
      type: GameEventType.passGo,
      description: `Player ${game.currentPlayer + 1} passes GO and gets $${passGoMoney}`,
    });
    currentPlayer.money += passGoMoney;
  }

  if (paysRent) {
    const rent = nextSquare.price * rentPercentage;
    events.unshift({
      type: GameEventType.payRent,
      description: `Player ${game.currentPlayer + 1} pays $${rent} rent to ${nextSquare.owner}`,
    });
    currentPlayer.money -= rent;
    game.players.find((p) => p.name === nextSquare.owner)!.money += rent;

    if (currentPlayer.money < 0) {
      // TODO Allow selling/mortgaging properties
      events.unshift({
        type: GameEventType.bankruptcy,
        description: `Player ${game.currentPlayer + 1} goes bankrupt`,
      });
      currentPlayer.status = PlayerStatus.bankrupt;
      // TODO Select winning player if only one remaining
    }
  }

  return {
    ...game,
    turnPhase: TurnPhase.play,
    events: events.concat(game.events),
  };
};
