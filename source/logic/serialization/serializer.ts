import {
  GamePhase,
  LiquidationReason,
  PropertyType,
  SquareType,
  TransitionType,
} from '../../enums';
import { EventMinified, Game, GameMinified, PlayerMinified, SquareMinified } from '../../types';
import { eventsMap, Minifier } from './events-map';

export const serializeGame = (game: Game): string => {
  const minifiedGame: GameMinified = {
    ci: game.currentPlayerId,
    cp: game.centerPot,
    d: game.dice,
    eh: game.eventHistory.map<EventMinified>((event) => {
      const minify: Minifier = eventsMap[event.type].minify;
      return minify(event);
    }),
    n: game.notifications.map<EventMinified>((event) => {
      const minify: Minifier = eventsMap[event.type].minify;
      return minify(event);
    }),
    nci: game.nextCardIds,
    pl: game.players.map<PlayerMinified>((player) => ({
      c: player.color,
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
    ...(game.phase === GamePhase.liquidation
      ? game.reason === LiquidationReason.buyProperty
        ? { ph: game.phase, t: game.reason, pp: game.pendingPrompt }
        : { ph: game.phase, t: game.reason, pe: game.pendingEvent }
      : game.phase === GamePhase.prompt
      ? { ph: game.phase, pr: game.prompt }
      : game.phase === GamePhase.trade
      ? {
          ph: game.phase,
          pp: game.previousPhase,
          ot: game.other,
          ows: game.ownSquaresId,
        }
      : game.phase === GamePhase.uiTransition
      ? game.transitionType === TransitionType.player
        ? {
            ph: game.phase,
            tt: game.transitionType,
            td: game.transitionData,
          }
        : { ph: game.phase, tt: game.transitionType }
      : { ph: game.phase }),
  };

  return JSON.stringify(minifiedGame);
};
