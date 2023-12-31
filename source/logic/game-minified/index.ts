import { PropertyType, SquareType } from '../../enums';
import {
  Game,
  GameEvent,
  GameEventMinified,
  GameMinified,
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
    e: game.events.map<GameEventMinified>((event) => {
      const minify: Minifier = eventsMap[event.type].minify;
      return minify(event);
    }),
    g: game.gamePhase,
    n: game.notifications,
    p: game.players.map<PlayerMinified>((player) => ({
      c: player.color,
      i: player.id,
      m: player.money,
      n: player.name,
      p: player.properties,
      s: player.status,
      si: player.squareId,
      t: player.turnsInJail,
    })),
    s: game.squares.map<SquareMinified>((square) => {
      const minifiedSquare: SquareMinified = {
        i: square.id,
      };

      if (square.type === SquareType.property) {
        minifiedSquare.o = square.ownerId;
        minifiedSquare.s = square.status;

        if (square.propertyType === PropertyType.street) {
          minifiedSquare.h = square.houses;
        }
      }

      return minifiedSquare;
    }),
  };
};

export const restoreMinifiedGame = (game: GameMinified): Game => {
  return {
    currentPlayerId: game.ci,
    centerPot: game.cp,
    dice: game.d,
    events: game.e.map<GameEvent>((e) => {
      const restore: Restorer = eventsMap[e.t].restore;
      return restore(e);
    }),
    gamePhase: game.g,
    notifications: game.n,
    players: game.p.map<Player>((p) => ({
      color: p.c,
      id: p.i,
      money: p.m,
      name: p.n,
      properties: p.p,
      status: p.s,
      squareId: p.si,
      turnsInJail: p.t,
    })),
    squares: game.s.map<Square>((s) => {
      const square: Square = squaresMap[s.i];

      if (square.type === SquareType.property) {
        square.ownerId = s.o;
        square.status = s.s;

        if (square.propertyType === PropertyType.street) {
          square.houses = s.h;
        }
      }

      return square;
    }),
  };
};
