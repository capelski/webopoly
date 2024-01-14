import { PropertyType, SquareType } from '../../enums';
import {
  Change,
  ChangeMinified,
  Game,
  GameMinified,
  Player,
  PlayerMinified,
  Square,
  SquareMinified,
} from '../../types';
import { changesMap, Minifier, Restorer } from './changes-map';
import { squaresMap } from './squares-map';

export const minifyGame = (game: Game): GameMinified => {
  return {
    ch: game.changeHistory.map<ChangeMinified>((change) => {
      const minify: Minifier = changesMap[change.type].minify;
      return minify(change);
    }),
    ci: game.currentPlayerId,
    cp: game.centerPot,
    d: game.dice,
    g: game.gamePhase,
    i: game.incomingChanges,
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
  };
};

export const restoreMinifiedGame = (game: GameMinified): Game => {
  return {
    centerPot: game.cp,
    changeHistory: game.ch.map<Change>((c) => {
      const restore: Restorer = changesMap[c.t].restore;
      return restore(c);
    }),
    currentPlayerId: game.ci,
    dice: game.d,
    gamePhase: game.g,
    incomingChanges: game.i,
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
  };
};
