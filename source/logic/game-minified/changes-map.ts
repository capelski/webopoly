import { ChangeType } from '../../enums';
import {
  Change,
  ChangeMinified,
  GenericChange,
  GenericChangeMinified,
  GenericChangeType,
  PropertyChange,
  PropertyChangeMinified,
  PropertyChangeType,
} from '../../types';

export type Minifier<T = ChangeType> = (change: Change & { type: T }) => ChangeMinified & { t: T };

export type Restorer<T = ChangeType> = (c: ChangeMinified & { t: T }) => Change & { type: T };

const genericChangeMinifier = <T extends GenericChangeType>(
  change: GenericChange & { type: T },
): GenericChangeMinified & { t: T } => ({ p: change.playerId, t: change.type });

const genericChangeRestorer = <T extends GenericChangeType>(
  c: GenericChangeMinified & { t: T },
): GenericChange & { type: T } => ({ playerId: c.p, type: c.t });

const propertyChangeMinifier = <T extends PropertyChangeType>(
  change: PropertyChange & { type: T },
): PropertyChangeMinified & { t: T } => ({
  p: change.playerId,
  pi: change.propertyId,
  t: change.type,
});

const propertyChangeRestorer = <T extends PropertyChangeType>(
  c: PropertyChangeMinified & { t: T },
): PropertyChange & { type: T } => ({ playerId: c.p, propertyId: c.pi, type: c.t });

export const changesMap: {
  [TKey in ChangeType]: { minify: Minifier<TKey>; restore: Restorer<TKey> };
} = {
  [ChangeType.answerOffer]: {
    minify: (change) => ({
      a: change.amount,
      an: change.answer,
      o: change.offerType,
      p: change.playerId,
      pi: change.propertyId,
      tp: change.targetPlayerId,
      t: change.type,
    }),
    restore: (c) => ({
      answer: c.an,
      amount: c.a,
      offerType: c.o,
      playerId: c.p,
      propertyId: c.pi,
      targetPlayerId: c.tp,
      type: c.t,
    }),
  },
  [ChangeType.bankruptcy]: { minify: genericChangeMinifier, restore: genericChangeRestorer },
  [ChangeType.buyProperty]: { minify: propertyChangeMinifier, restore: propertyChangeRestorer },
  [ChangeType.buildHouse]: { minify: propertyChangeMinifier, restore: propertyChangeRestorer },
  [ChangeType.chance]: {
    minify: (change) => ({ c: change.cardId, p: change.playerId, t: change.type }),
    restore: (c) => ({ cardId: c.c, playerId: c.p, type: c.t }),
  },
  [ChangeType.clearMortgage]: { minify: propertyChangeMinifier, restore: propertyChangeRestorer },
  [ChangeType.communityChest]: {
    minify: (change) => ({ c: change.cardId, p: change.playerId, t: change.type }),
    restore: (c) => ({ cardId: c.c, playerId: c.p, type: c.t }),
  },
  [ChangeType.endTurn]: { minify: genericChangeMinifier, restore: genericChangeRestorer },
  [ChangeType.freeParking]: {
    minify: (change) => ({ p: change.playerId, po: change.pot, t: change.type }),
    restore: (c) => ({ playerId: c.p, pot: c.po, type: c.t }),
  },
  [ChangeType.getOutOfJail]: { minify: genericChangeMinifier, restore: genericChangeRestorer },
  [ChangeType.goToJail]: { minify: genericChangeMinifier, restore: genericChangeRestorer },
  [ChangeType.mortgage]: { minify: propertyChangeMinifier, restore: propertyChangeRestorer },
  [ChangeType.passGo]: { minify: genericChangeMinifier, restore: genericChangeRestorer },
  [ChangeType.payRent]: {
    minify: (change) => ({
      l: change.landlordId,
      p: change.playerId,
      r: change.rent,
      t: change.type,
    }),
    restore: (c) => ({ landlordId: c.l, playerId: c.p, rent: c.r, type: c.t }),
  },
  [ChangeType.payTax]: {
    minify: (change) => ({ p: change.playerId, ta: change.tax, t: change.type }),
    restore: (e) => ({ playerId: e.p, tax: e.ta, type: e.t }),
  },
  [ChangeType.placeOffer]: {
    minify: (change) => ({
      a: change.amount,
      o: change.offerType,
      p: change.playerId,
      pi: change.propertyId,
      t: change.type,
      tp: change.targetPlayerId,
    }),
    restore: (c) => ({
      amount: c.a,
      offerType: c.o,
      playerId: c.p,
      propertyId: c.pi,
      targetPlayerId: c.tp,
      type: c.t,
    }),
  },
  [ChangeType.playerWin]: { minify: genericChangeMinifier, restore: genericChangeRestorer },
  [ChangeType.remainInJail]: {
    minify: (change) => ({ p: change.playerId, tj: change.turnsInJail, t: change.type }),
    restore: (c) => ({ playerId: c.p, turnsInJail: c.tj, type: c.t }),
  },
  [ChangeType.rollDice]: { minify: genericChangeMinifier, restore: genericChangeRestorer },
  [ChangeType.sellHouse]: { minify: propertyChangeMinifier, restore: propertyChangeRestorer },
};
