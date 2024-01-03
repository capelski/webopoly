import { GameEventType } from '../../enums';
import { TypedGameEvent, TypedGameEventMinified } from '../../types';

export const eventsMap: {
  [TKey in GameEventType]: {
    minify: (event: TypedGameEvent<TKey>) => TypedGameEventMinified<TKey>;
    restore: (e: TypedGameEventMinified<TKey>) => TypedGameEvent<TKey>;
  };
} = {
  [GameEventType.bankruptcy]: {
    minify: (event) => ({ p: event.playerId, t: event.type }),
    restore: (e) => ({ playerId: e.p, type: e.t }),
  },
  [GameEventType.buyProperty]: {
    minify: (event) => ({ p: event.playerId, pr: event.propertyId, t: event.type }),
    restore: (e) => ({ playerId: e.p, propertyId: e.pr, type: e.t }),
  },
  [GameEventType.chance]: {
    minify: (event) => ({ c: event.cardId, p: event.playerId, t: event.type }),
    restore: (e) => ({ cardId: e.c, playerId: e.p, type: e.t }),
  },
  [GameEventType.clearMortgage]: {
    minify: (event) => ({ p: event.playerId, pr: event.propertyId, t: event.type }),
    restore: (e) => ({ playerId: e.p, propertyId: e.pr, type: e.t }),
  },
  [GameEventType.communityChest]: {
    minify: (event) => ({ c: event.cardId, p: event.playerId, t: event.type }),
    restore: (e) => ({ cardId: e.c, playerId: e.p, type: e.t }),
  },
  [GameEventType.freeParking]: {
    minify: (event) => ({ p: event.playerId, po: event.pot, t: event.type }),
    restore: (e) => ({ playerId: e.p, pot: e.po, type: e.t }),
  },
  [GameEventType.getOutOfJail]: {
    minify: (event) => ({ d: event.dice, p: event.playerId, s: event.squareId, t: event.type }),
    restore: (e) => ({ dice: e.d, playerId: e.p, squareId: e.s, type: e.t }),
  },
  [GameEventType.goToJail]: {
    minify: (event) => ({ p: event.playerId, t: event.type }),
    restore: (e) => ({ playerId: e.p, type: e.t }),
  },
  [GameEventType.passGo]: {
    minify: (event) => ({ p: event.playerId, t: event.type }),
    restore: (e) => ({ playerId: e.p, type: e.t }),
  },
  [GameEventType.mortgage]: {
    minify: (event) => ({ p: event.playerId, pr: event.propertyId, t: event.type }),
    restore: (e) => ({ playerId: e.p, propertyId: e.pr, type: e.t }),
  },
  [GameEventType.payRent]: {
    minify: (event) => ({ l: event.landlordId, p: event.playerId, r: event.rent, t: event.type }),
    restore: (e) => ({ landlordId: e.l, playerId: e.p, rent: e.r, type: e.t }),
  },
  [GameEventType.payTax]: {
    minify: (event) => ({ p: event.playerId, ta: event.tax, t: event.type }),
    restore: (e) => ({ playerId: e.p, tax: e.ta, type: e.t }),
  },
  [GameEventType.playerWin]: {
    minify: (event) => ({ p: event.playerId, t: event.type }),
    restore: (e) => ({ playerId: e.p, type: e.t }),
  },
  [GameEventType.remainInJail]: {
    minify: (event) => ({ p: event.playerId, tj: event.turnsInJail, t: event.type }),
    restore: (e) => ({ playerId: e.p, turnsInJail: e.tj, type: e.t }),
  },
  [GameEventType.rollDice]: {
    minify: (event) => ({ d: event.dice, p: event.playerId, s: event.squareId, t: event.type }),
    restore: (e) => ({ dice: e.d, playerId: e.p, squareId: e.s, type: e.t }),
  },
};
