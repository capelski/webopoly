import { PropertyType, SquareType } from '../../enums';
import {
  Game,
  GameMinified,
  Notification,
  NotificationMinified,
  Player,
  PlayerMinified,
  Square,
  SquareMinified,
} from '../../types';
import { Minifier, notificationsMap, Restorer } from './notifications-map';
import { squaresMap } from './squares-map';

export const minifyGame = (game: Game): GameMinified => {
  return {
    ci: game.currentPlayerId,
    cp: game.centerPot,
    d: game.dice,
    n: game.notifications.map<NotificationMinified>((notification) => {
      const minify: Minifier = notificationsMap[notification.type].minify;
      return minify(notification);
    }),
    pa: game.pastNotifications.map<NotificationMinified>((notification) => {
      const minify: Minifier = notificationsMap[notification.type].minify;
      return minify(notification);
    }),
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
    pr: game.prompt,
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
    currentPlayerId: game.ci,
    dice: game.d,
    notifications: game.n.map<Notification>((n) => {
      const restore: Restorer = notificationsMap[n.t].restore;
      return restore(n);
    }),
    pastNotifications: game.pa.map<Notification>((n) => {
      const restore: Restorer = notificationsMap[n.t].restore;
      return restore(n);
    }),
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
    prompt: game.pr,
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
