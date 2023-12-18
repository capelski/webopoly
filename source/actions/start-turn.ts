import { GameEventType, SquareType, TaxType, TurnPhase } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { getCurrentPlayer, getPlayerById } from '../logic';
import { currencySymbol, maxMovement, passGoMoney, rentPercentage } from '../parameters';
import { Game, GameEvent } from '../types';

export const startTurn = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const dice = Math.max(2, Math.round(Math.random() * maxMovement));
  const nextPosition = (currentPlayer.position + dice) % game.squares.length;
  const nextSquare = game.squares[nextPosition];
  const passesGo = nextPosition < currentPlayer.position;
  const paysRent =
    nextSquare.type === SquareType.property &&
    nextSquare.ownerId !== undefined &&
    nextSquare.ownerId !== currentPlayer.id;
  const isTax = nextSquare.type === SquareType.tax;
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
      description: `${currentPlayer.name} passes GO and gets ${currencySymbol}${passGoMoney}`,
    });
    currentPlayer.money += passGoMoney;
  }

  let tax = 0;
  if (paysRent) {
    const rent = nextSquare.price * rentPercentage;
    const landlord = getPlayerById(game, nextSquare.ownerId!);
    events.unshift({
      type: GameEventType.payRent,
      description: `${currentPlayer.name} pays ${currencySymbol}${rent} rent to ${landlord.name}`,
    });
    currentPlayer.money -= rent;
    landlord.money += rent;
  } else if (isTax) {
    tax = nextSquare.taxType === TaxType.income ? Math.min(0.1 * currentPlayer.money, 200) : 100;
    currentPlayer.money -= tax;
    events.unshift({
      type: GameEventType.payTax,
      description: `${currentPlayer.name} pays ${currencySymbol}${tax} in taxes`,
    });
  }

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
    centerPot: game.centerPot + tax,
    dice,
    turnPhase: TurnPhase.play,
    events: events.concat(game.events),
  };
};
