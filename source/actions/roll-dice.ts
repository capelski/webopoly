import { GameEventType, SquareType, TaxType, TurnPhase } from '../enums';
import { getCurrentPlayer, getPlayerById, getsOutOfJail, isPlayerInJail } from '../logic';
import { currencySymbol, passGoMoney, rentPercentage } from '../parameters';
import { Dice, Game, GameEvent } from '../types';

export const rollDice = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const dice: Dice = [
    Math.max(1, Math.round(Math.random() * 6)),
    Math.max(1, Math.round(Math.random() * 6)),
  ];
  const events: GameEvent[] = [];
  const notifications: GameEvent[] = [];

  const isInJail = isPlayerInJail(currentPlayer);
  const escapesJail = getsOutOfJail(currentPlayer, dice);

  if (!isInJail || escapesJail) {
    const movement = dice.reduce((x, y) => x + y, 0);
    const nextPosition = (currentPlayer.position + movement) % game.squares.length;
    const nextSquare = game.squares.find((s) => s.position === nextPosition)!;

    if (escapesJail) {
      notifications.push({
        description: `${currentPlayer.name} rolls ${game.dice.join(
          '-',
        )}, gets out fail and lands in ${nextSquare.name}`,
        type: GameEventType.getsOutOfJail,
      });
    } else {
      events.push({
        description: `${currentPlayer.name} rolls ${dice.join('-')} and lands in ${
          nextSquare.name
        }`,
        type: GameEventType.rollDice,
      });
    }

    const goesToJail = nextSquare.type === SquareType.goToJail;
    if (goesToJail) {
      notifications.push({
        type: GameEventType.goToJail,
        description: `${currentPlayer.name} goes to jail for 3 turns`,
      });
    } else {
      const passesGo = nextPosition < currentPlayer.position;
      const paysRent =
        nextSquare.type === SquareType.property &&
        nextSquare.ownerId !== undefined &&
        nextSquare.ownerId !== currentPlayer.id;
      const paysTaxes = nextSquare.type === SquareType.tax;

      if (passesGo) {
        notifications.push({
          type: GameEventType.passGo,
          description: `${currentPlayer.name} passes GO and gets ${currencySymbol}${passGoMoney}`,
        });
      }
      if (paysRent) {
        const rent = nextSquare.price * rentPercentage;
        const landlord = getPlayerById(game, nextSquare.ownerId!);
        notifications.push({
          type: GameEventType.payRent,
          rent,
          landlord,
          description: `${currentPlayer.name} pays ${currencySymbol}${rent} rent to ${landlord.name}`,
        });
      }
      if (paysTaxes) {
        const tax =
          nextSquare.taxType === TaxType.income ? Math.min(0.1 * currentPlayer.money, 200) : 100;
        currentPlayer.money -= tax;
        notifications.push({
          type: GameEventType.payTax,
          tax,
          description: `${currentPlayer.name} pays ${currencySymbol}${tax} in taxes`,
        });
      }
    }

    currentPlayer.position = nextPosition;
  } else {
    const turnsInJail = currentPlayer.turnsInJail - 1;
    const text = turnsInJail === 0 ? 'the last turn' : `${turnsInJail} more turn(s)`;
    notifications.push({
      description: `${currentPlayer.name} remains in jail for ${text}`,
      turnsInJail,
      type: GameEventType.remainsInJail,
    });
  }

  return {
    ...game,
    dice,
    turnPhase: TurnPhase.play,
    notifications,
    events: events.concat(game.events),
  };
};
