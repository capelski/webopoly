import { GameEventType, SquareType, TaxType, TurnPhase } from '../enums';
import { PlayerStatus } from '../enums/player-status';
import { getCurrentPlayer, getPlayerById, isPlayerInJail } from '../logic';
import { currencySymbol, passGoMoney, rentPercentage } from '../parameters';
import { Game, GameEvent } from '../types';

export const startTurn = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const dice = [
    Math.max(1, Math.round(Math.random() * 6)),
    Math.max(1, Math.round(Math.random() * 6)),
  ];
  const events: GameEvent[] = [];
  let nextPosition =
    (currentPlayer.position + dice.reduce((x, y) => x + y, 0)) % game.squares.length;
  const nextSquare = game.squares[nextPosition];
  let tax = 0;

  let isInJail = isPlayerInJail(currentPlayer);

  if (isInJail && dice[0] === dice[1]) {
    currentPlayer.turnsInJail = 0;
    isInJail = false;
    events.unshift({
      description: `${currentPlayer.name} rolls ${dice.join('-')}, gets out of jail and lands in ${
        nextSquare.name
      }`,
      type: GameEventType.startTurn,
    });
  } else if (isInJail) {
    currentPlayer.turnsInJail--;
    const turnsInJails =
      currentPlayer.turnsInJail === 0
        ? 'the last turn'
        : `${currentPlayer.turnsInJail} more turn(s)`;
    events.unshift({
      description: `${currentPlayer.name} remains in jail for ${turnsInJails}`,
      type: GameEventType.remainsInJail,
    });
  } else {
    events.unshift({
      description: `${currentPlayer.name} rolls ${dice.join('-')} and lands in ${nextSquare.name}`,
      type: GameEventType.startTurn,
    });
  }

  if (!isInJail) {
    const goesToJail = nextSquare.type === SquareType.goToJail;
    if (goesToJail) {
      nextPosition = game.squares.find((s) => s.type === SquareType.jail)!.position;
    }
    const passesGo = !goesToJail && nextPosition < currentPlayer.position;
    const paysRent =
      nextSquare.type === SquareType.property &&
      nextSquare.ownerId !== undefined &&
      nextSquare.ownerId !== currentPlayer.id;
    const isTax = nextSquare.type === SquareType.tax;

    currentPlayer.position = nextPosition;

    if (passesGo) {
      events.unshift({
        type: GameEventType.passGo,
        description: `${currentPlayer.name} passes GO and gets ${currencySymbol}${passGoMoney}`,
      });
      currentPlayer.money += passGoMoney;
    }

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
    } else if (goesToJail) {
      events.unshift({
        type: GameEventType.goToJail,
        description: `${currentPlayer.name} goes to jail for 3 turns`,
      });
      currentPlayer.turnsInJail = 3;
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
  }

  return {
    ...game,
    centerPot: game.centerPot + tax,
    dice,
    turnPhase: TurnPhase.play,
    events: events.concat(game.events),
  };
};
