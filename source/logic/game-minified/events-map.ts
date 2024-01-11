import { GameEventType } from '../../enums';
import {
  GameEvent,
  GameEventMinified,
  GenericEvent,
  GenericEventMinified,
  PropertyEvent,
  PropertyEventMinified,
} from '../../types';

export type Minifier<T = GameEventType> = (
  event: GameEvent & { type: T },
) => GameEventMinified & { t: T };

export type Restorer<T = GameEventType> = (
  e: GameEventMinified & { t: T },
) => GameEvent & { type: T };

const genericEventMinifier = <T extends GameEventType>(
  event: GenericEvent & { type: T },
): GenericEventMinified & { t: T } => ({ p: event.playerId, t: event.type });

const genericEventRestorer = <T extends GameEventType>(
  e: GenericEventMinified & { t: T },
): GenericEvent & { type: T } => ({ playerId: e.p, type: e.t });

const propertyEventMinifier = <T extends GameEventType>(
  event: PropertyEvent & { type: T },
): PropertyEventMinified & { t: T } => ({ p: event.playerId, pr: event.propertyId, t: event.type });

const propertyEventRestorer = <T extends GameEventType>(
  e: PropertyEventMinified & { t: T },
): PropertyEvent & { type: T } => ({ playerId: e.p, propertyId: e.pr, type: e.t });

export const eventsMap: {
  [TKey in GameEventType]: { minify: Minifier<TKey>; restore: Restorer<TKey> };
} = {
  [GameEventType.bankruptcy]: { minify: genericEventMinifier, restore: genericEventRestorer },
  [GameEventType.buyProperty]: { minify: propertyEventMinifier, restore: propertyEventRestorer },
  [GameEventType.buildHouse]: { minify: propertyEventMinifier, restore: propertyEventRestorer },
  [GameEventType.chance]: {
    minify: (event) => ({ c: event.cardId, p: event.playerId, t: event.type }),
    restore: (e) => ({ cardId: e.c, playerId: e.p, type: e.t }),
  },
  [GameEventType.clearMortgage]: { minify: propertyEventMinifier, restore: propertyEventRestorer },
  [GameEventType.communityChest]: {
    minify: (event) => ({ c: event.cardId, p: event.playerId, t: event.type }),
    restore: (e) => ({ cardId: e.c, playerId: e.p, type: e.t }),
  },
  [GameEventType.endTurn]: { minify: genericEventMinifier, restore: genericEventRestorer },
  [GameEventType.freeParking]: {
    minify: (event) => ({ p: event.playerId, po: event.pot, t: event.type }),
    restore: (e) => ({ playerId: e.p, pot: e.po, type: e.t }),
  },
  [GameEventType.getOutOfJail]: { minify: genericEventMinifier, restore: genericEventRestorer },
  [GameEventType.goToJail]: { minify: genericEventMinifier, restore: genericEventRestorer },
  [GameEventType.mortgage]: { minify: propertyEventMinifier, restore: propertyEventRestorer },
  [GameEventType.passGo]: { minify: genericEventMinifier, restore: genericEventRestorer },
  [GameEventType.payRent]: {
    minify: (event) => ({ l: event.landlordId, p: event.playerId, r: event.rent, t: event.type }),
    restore: (e) => ({ landlordId: e.l, playerId: e.p, rent: e.r, type: e.t }),
  },
  [GameEventType.payTax]: {
    minify: (event) => ({ p: event.playerId, ta: event.tax, t: event.type }),
    restore: (e) => ({ playerId: e.p, tax: e.ta, type: e.t }),
  },
  [GameEventType.playerWin]: { minify: genericEventMinifier, restore: genericEventRestorer },
  [GameEventType.remainInJail]: {
    minify: (event) => ({ p: event.playerId, tj: event.turnsInJail, t: event.type }),
    restore: (e) => ({ playerId: e.p, turnsInJail: e.tj, type: e.t }),
  },
  [GameEventType.rollDice]: {
    minify: (event) => ({ d: event.dice, p: event.playerId, t: event.type }),
    restore: (e) => ({ dice: e.d, playerId: e.p, type: e.t }),
  },
  [GameEventType.sellHouse]: { minify: propertyEventMinifier, restore: propertyEventRestorer },
};
