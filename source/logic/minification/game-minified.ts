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
    m: game.mustStartTurn,
    n: game.notifications.map<NotificationMinified>((notification) => {
      const minify: Minifier = notificationsMap[notification.type].minify;
      return minify(notification);
    }),
    nh: game.nextChanceCardIds,
    no: game.nextCommunityCardIds,
    pa: game.pastNotifications.map<NotificationMinified>((notification) => {
      const minify: Minifier = notificationsMap[notification.type].minify;
      return minify(notification);
    }),
    p: game.players.map<PlayerMinified>((player) => ({
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

export const restoreMinifiedGame = (g: GameMinified): Game => {
  return {
    centerPot: g.cp,
    currentPlayerId: g.ci,
    dice: g.d,
    mustStartTurn: g.m,
    nextChanceCardIds: g.nh,
    nextCommunityCardIds: g.no,
    notifications: g.n.map<Notification>((n) => {
      const restore: Restorer = notificationsMap[n.t].restore;
      return restore(n);
    }),
    pastNotifications: g.pa.map<Notification>((n) => {
      const restore: Restorer = notificationsMap[n.t].restore;
      return restore(n);
    }),
    players: g.p.map<Player>((p) => ({
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
    prompt: g.pr,
    squares: g.s.map<Square>((s) => {
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
