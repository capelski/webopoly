import { GamePhase, PropertyType, SquareType } from '../../enums';
import { EventMinified, Game, MinifiedGame, PlayerMinified, SquareMinified } from '../../types';
import { eventsMap, Minifier } from './events-map';

export const serializeGame = (game: Game): string => {
  const minifiedGame: MinifiedGame = {
    ci: game.currentPlayerId,
    cp: game.centerPot,
    d: game.dice,
    da: game.defaultAction,
    eh: game.eventHistory.map<EventMinified>((event) => {
      const minify = eventsMap[event.type].minify as Minifier;
      return minify(event);
    }),
    n: game.notifications.map<EventMinified>((event) => {
      const minify = eventsMap[event.type].minify as Minifier;
      return minify(event);
    }),
    nci: game.nextCardIds,
    pl: game.players.map<PlayerMinified>((player) => ({
      c: player.color,
      d: player.doublesInARow,
      g: player.getOutOfJail,
      i: player.id,
      ij: player.isInJail,
      m: player.money,
      n: player.name,
      p: player.properties,
      s: player.status,
      si: player.squareId,
      t: player.turnsInJail,
    })),
    sq: game.squares.map<SquareMinified>((square) => {
      return square.type === SquareType.go ||
        square.type === SquareType.goToJail ||
        square.type === SquareType.jail ||
        square.type === SquareType.parking ||
        square.type === SquareType.surprise
        ? {
            i: square.id,
            t: square.type,
          }
        : square.type === SquareType.property
        ? square.propertyType === PropertyType.station
          ? {
              i: square.id,
              t: square.type,
              pt: square.propertyType,
              o: square.ownerId,
              s: square.status,
            }
          : square.propertyType === PropertyType.street
          ? {
              i: square.id,
              t: square.type,
              pt: square.propertyType,
              o: square.ownerId,
              s: square.status,
              h: square.houses,
            }
          : {
              i: square.id,
              t: square.type,
              pt: square.propertyType,
              o: square.ownerId,
              s: square.status,
            }
        : {
            i: square.id,
            t: square.type,
          };
    }),
    ...(game.phase === GamePhase.answerOffer
      ? { ph: game.phase, pd: game.phaseData }
      : game.phase === GamePhase.answerTrade
      ? { ph: game.phase, pd: game.phaseData }
      : game.phase === GamePhase.applyCard
      ? { ph: game.phase, pd: game.phaseData }
      : game.phase === GamePhase.buyProperty
      ? { ph: game.phase, pd: game.phaseData }
      : game.phase === GamePhase.buyingLiquidation
      ? { ph: game.phase, pd: game.phaseData }
      : game.phase === GamePhase.cannotPay
      ? { ph: game.phase, pd: game.phaseData }
      : game.phase === GamePhase.paymentLiquidation
      ? { ph: game.phase, pd: game.phaseData }
      : game.phase === GamePhase.playerAnimation
      ? { ph: game.phase, pd: game.phaseData }
      : game.phase === GamePhase.playerWins
      ? { ph: game.phase, pd: game.phaseData }
      : game.phase === GamePhase.trade
      ? { ph: game.phase, pd: game.phaseData }
      : { ph: game.phase }),
  };

  return JSON.stringify(minifiedGame);
};
