import { GameEventType, GamePhase, PropertyType, SquareType, TaxType } from '../enums';
import {
  getCurrentPlayer,
  getNextChanceCardId,
  getNextCommunityChestCardId,
  getNextSquareId,
  getPlayerById,
  getsOutOfJail,
  isPlayerInJail,
  passesGo,
  paysRent,
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
    const nextSquareId = getNextSquareId(game, movement);
    const nextSquare = game.squares.find((s) => s.id === nextSquareId)!;

    if (escapesJail) {
      toasts.push({
        dice: stringifedDice,
        playerId: currentPlayer.id,
        squareId: nextSquare.id,
        type: GameEventType.getOutOfJail,
      });
    } else {
      events.push({
        dice: stringifedDice,
        playerId: currentPlayer.id,
        squareId: nextSquare.id,
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
      const payRent =
        nextSquare.type === SquareType.property && paysRent(currentPlayer, nextSquare);
      const payTaxes = nextSquare.type === SquareType.tax;
      const landsInFreeParking = nextSquare.type === SquareType.parking && game.centerPot > 0;
      const landsInChance = nextSquare.type === SquareType.chance;
      const landsInCommunityChest = nextSquare.type === SquareType.communityChest;

      if (passesGo(game, currentPlayer.squareId, nextSquareId)) {
        toasts.push({
          playerId: currentPlayer.id,
          type: GameEventType.passGo,
        });
      }

      if (payRent) {
        const landlord = getPlayerById(game, nextSquare.ownerId!);
        const properties = landlord.properties.map(
          (propertyId) => game.squares.find((s) => s.id === propertyId)!,
        );
        const stationProperties = properties.filter(
          (p) => p.type === SquareType.property && p.propertyType === PropertyType.station,
        );
        const utilityProperties = properties.filter(
          (p) => p.type === SquareType.property && p.propertyType === PropertyType.utility,
        );
        const rent =
          nextSquare.propertyType === PropertyType.station
            ? stationRent * stationProperties.length
            : nextSquare.propertyType === PropertyType.street
            ? nextSquare.price * rentPercentage
            : movement * (utilityProperties.length === 2 ? 10 : 4);

        toasts.push({
          landlordId: nextSquare.ownerId!,
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

    currentPlayer.squareId = nextSquareId;
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
