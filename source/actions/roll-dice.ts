import { GameEventType, GamePhase, SquareType, TaxType } from '../enums';
import {
  getCurrentPlayer,
  getNextChanceCardId,
  getNextCommunityChestCardId,
  getPlayerById,
  getsOutOfJail,
  isPlayerInJail,
  passesGo,
  paysRent,
  toPropertySquare,
} from '../logic';
import { rentPercentage, stationRent } from '../parameters';
import { Dice, Game, GameEvent } from '../types';

export const rollDice = (game: Game): Game => {
  const currentPlayer = getCurrentPlayer(game);
  const dice: Dice = [
    Math.max(1, Math.round(Math.random() * 6)),
    Math.max(1, Math.round(Math.random() * 6)),
  ];
  const stringifedDice = dice.join('-');
  const events: GameEvent[] = [];
  const modals: GameEvent[] = [];
  const toasts: GameEvent[] = [];

  const isInJail = isPlayerInJail(currentPlayer);
  const escapesJail = getsOutOfJail(currentPlayer, dice);

  if (!isInJail || escapesJail) {
    const movement = dice.reduce((x, y) => x + y, 0);
    // TODO Function to get nextSquare without relying on indexes
    const nextPosition = (currentPlayer.squareId + movement) % game.squares.length;
    const nextSquare = game.squares.find((s) => s.id === nextPosition)!;

    if (escapesJail) {
      toasts.push({
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
      toasts.push({
        playerId: currentPlayer.id,
        type: GameEventType.goToJail,
      });
    } else {
      const propertySquare = toPropertySquare(nextSquare);
      const payRent = propertySquare && paysRent(currentPlayer, propertySquare);
      const payTaxes = nextSquare.type === SquareType.tax;
      const landsInFreeParking = nextSquare.type === SquareType.parking && game.centerPot > 0;
      const landsInChance = nextSquare.type === SquareType.chance;
      const landsInCommunityChest = nextSquare.type === SquareType.communityChest;

      if (passesGo(currentPlayer, nextPosition)) {
        toasts.push({
          playerId: currentPlayer.id,
          type: GameEventType.passGo,
        });
      }

      if (payRent) {
        const landlord = getPlayerById(game, propertySquare.ownerId!);
        const properties = landlord.properties.map(
          (propertyId) => game.squares.find((s) => s.id === propertyId)!,
        );
        const utilityProperties = properties.filter((p) => p.type === SquareType.utility);
        const rent =
          nextSquare.type === SquareType.station
            ? stationRent * properties.filter((p) => p.type === SquareType.station).length
            : nextSquare.type === SquareType.street
            ? propertySquare.price * rentPercentage
            : movement * (utilityProperties.length === 2 ? 10 : 4);

        toasts.push({
          landlordId: propertySquare.ownerId!,
          playerId: currentPlayer.id,
          rent,
          type: GameEventType.payRent,
        });
      } else if (payTaxes) {
        const tax =
          nextSquare.taxType === TaxType.income ? Math.min(0.1 * currentPlayer.money, 200) : 100;
        toasts.push({
          playerId: currentPlayer.id,
          tax,
          type: GameEventType.payTax,
        });
      } else if (landsInFreeParking) {
        toasts.push({
          playerId: currentPlayer.id,
          pot: game.centerPot,
          type: GameEventType.freeParking,
        });
      } else if (landsInChance) {
        modals.push({
          cardId: getNextChanceCardId(),
          playerId: currentPlayer.id,
          type: GameEventType.chance,
        });
      } else if (landsInCommunityChest) {
        modals.push({
          cardId: getNextCommunityChestCardId(),
          playerId: currentPlayer.id,
          type: GameEventType.communityChest,
        });
      }
    }

    currentPlayer.squareId = nextPosition;
  } else {
    const turnsInJail = currentPlayer.turnsInJail - 1;
    toasts.push({
      playerId: currentPlayer.id,
      turnsInJail,
      type: GameEventType.remainInJail,
    });
  }

  return {
    ...game,
    dice,
    events: events.concat(game.events),
    gamePhase:
      toasts.length > 0 ? GamePhase.toast : modals.length > 0 ? GamePhase.modal : GamePhase.play,
    modals,
    toasts,
  };
};
