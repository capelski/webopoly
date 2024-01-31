import { PropertyType, SquareType } from '../../enums';
import {
  EventMinified,
  Game,
  GameMinified,
  GEvent,
  Player,
  PlayerMinified,
  Square,
  SquareMinified,
} from '../../types';
import { eventsMap, Minifier, Restorer } from './events-map';
import { squaresMap } from './squares-map';

export const minifyGame = (game: Game): GameMinified => {
  return {
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
    nh: game.nextChanceCardIds,
    no: game.nextCommunityCardIds,
    pe: game.pendingEvent,
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
      return square.type === SquareType.chance ||
        square.type === SquareType.communityChest ||
        square.type === SquareType.go ||
        square.type === SquareType.goToJail ||
        square.type === SquareType.jail ||
        square.type === SquareType.parking
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
    st: game.status,
  };
};

export const restoreMinifiedGame = (g: GameMinified): Game => {
  return {
    centerPot: g.cp,
    currentPlayerId: g.ci,
    dice: g.d,
    eventHistory: g.eh.map<GEvent>((e) => {
      const restore: Restorer = eventsMap[e.t].restore;
      return restore(e);
    }),
    nextChanceCardIds: g.nh,
    nextCommunityCardIds: g.no,
    notifications: g.n.map<GEvent>((e) => {
      const restore: Restorer = eventsMap[e.t].restore;
      return restore(e);
    }),
    pendingEvent: g.pe,
    players: g.pl.map<Player>((p) => ({
      color: p.c,
      getOutOfJail: p.g,
      id: p.i,
      isInJail: p.ij,
      money: p.m,
      name: p.n,
      properties: p.p,
      status: p.s,
      squareId: p.si,
      turnsInJail: p.t,
    })),
    squares: g.sq.map<Square>((s) => {
      const square = squaresMap[s.i];

      if (square.type === SquareType.property && s.t === SquareType.property) {
        square.ownerId = s.o;
        square.status = s.s;

        if (square.propertyType === PropertyType.street && s.pt === PropertyType.street) {
          square.houses = s.h;
        }
      }

      return square;
    }),
    status: g.st,
  };
};
