import { GameEventType, GamePhase, SquareType, TaxType } from '../enums';
import { getCurrentPlayer, getPlayerById, getsOutOfJail, isPlayerInJail } from '../logic';
import { rentPercentage } from '../parameters';
import { Dice, Game, GameEvent } from '../types';

export const rollDice = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const dice: Dice = [
    Math.max(1, Math.round(Math.random() * 6)),
    Math.max(1, Math.round(Math.random() * 6)),
  ];
  const stringifedDice = dice.join('-');
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
        dice: stringifedDice,
        playerId: currentPlayer.id,
        squareName: nextSquare.name,
        type: GameEventType.getOutOfJail,
      });
    } else {
      events.push({
        dice: stringifedDice,
        playerId: currentPlayer.id,
        squareName: nextSquare.name,
        type: GameEventType.rollDice,
      });
    }

    const goesToJail = nextSquare.type === SquareType.goToJail;
    if (goesToJail) {
      notifications.push({
        playerId: currentPlayer.id,
        type: GameEventType.goToJail,
      });
    } else {
      const passGo = nextPosition < currentPlayer.position;
      const payRent =
        nextSquare.type === SquareType.property &&
        nextSquare.ownerId !== undefined &&
        nextSquare.ownerId !== currentPlayer.id;
      const payTaxes = nextSquare.type === SquareType.tax;
      const landsInFreeParking = nextSquare.type === SquareType.parking && game.centerPot > 0;

      if (passGo) {
        notifications.push({
          playerId: currentPlayer.id,
          type: GameEventType.passGo,
        });
      }
      if (payRent) {
        const rent = nextSquare.price * rentPercentage;
        const landlord = getPlayerById(game, nextSquare.ownerId!);
        notifications.push({
          landlord,
          playerId: currentPlayer.id,
          rent,
          type: GameEventType.payRent,
        });
      }
      if (payTaxes) {
        const tax =
          nextSquare.taxType === TaxType.income ? Math.min(0.1 * currentPlayer.money, 200) : 100;
        notifications.push({
          playerId: currentPlayer.id,
          tax,
          type: GameEventType.payTax,
        });
      }
      if (landsInFreeParking) {
        notifications.push({
          playerId: currentPlayer.id,
          pot: game.centerPot,
          type: GameEventType.freeParking,
        });
      }
    }

    currentPlayer.position = nextPosition;
  } else {
    const turnsInJail = currentPlayer.turnsInJail - 1;
    notifications.push({
      playerId: currentPlayer.id,
      turnsInJail,
      type: GameEventType.remainInJail,
    });
  }

  return {
    ...game,
    dice,
    gamePhase: GamePhase.play,
    notifications,
    events: events.concat(game.events),
  };
};
