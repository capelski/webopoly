import { EventSource, EventType } from '../../enums';
import { EventMinified, Id, Notification, PropertyEventType } from '../../types';

export type Minifier<T extends EventType = EventType> = (
  notification: Notification & { type: T },
) => EventMinified & { t: T };

export type Restorer<T extends EventType = EventType> = (
  e: EventMinified & { t: T },
) => Notification & { type: T };

type Mapper<T extends EventType = EventType> = {
  minify: Minifier<T>;
  restore: Restorer<T>;
};

const baseMinifier = <T extends EventType>(
  notification: Notification & { type: T },
): { p: Id; t: T } => ({ p: notification.playerId, t: notification.type });

const baseRestorer = <T extends EventType>(e: { p: Id; t: T }): { playerId: Id; type: T } => ({
  playerId: e.p,
  type: e.t,
});

const propertyMappers: Mapper<PropertyEventType> = {
  minify: (notification) => ({
    ...baseMinifier(notification),
    pi: notification.propertyId,
  }),
  restore: (e) => ({
    ...baseRestorer(e),
    propertyId: e.pi,
  }),
};

export const notificationsMap: {
  [TKey in EventType]: Mapper<TKey>;
} = {
  [EventType.answerOffer]: {
    minify: (notification) => ({
      ...baseMinifier(notification),
      a: notification.amount,
      an: notification.answer,
      o: notification.offerType,
      pi: notification.propertyId,
      tp: notification.targetPlayerId,
    }),
    restore: (e) => ({
      ...baseRestorer(e),
      answer: e.an,
      amount: e.a,
      offerType: e.o,
      propertyId: e.pi,
      targetPlayerId: e.tp,
    }),
  },
  [EventType.bankruptcy]: {
    minify: (notification) => ({ ...baseMinifier(notification), ci: notification.creditorId }),
    restore: (e) => ({ ...baseRestorer(e), creditorId: e.ci }),
  },
  [EventType.buyProperty]: <Mapper<EventType.buyProperty>>propertyMappers,
  [EventType.buildHouse]: <Mapper<EventType.buildHouse>>propertyMappers,
  [EventType.card]: {
    minify: (notification) => ({
      ...baseMinifier(notification),
      ci: notification.cardId,
      ct: notification.cardType,
    }),
    restore: (e) => ({
      ...baseRestorer(e),
      cardId: e.ci,
      cardType: e.ct,
    }),
  },
  [EventType.clearMortgage]: <Mapper<EventType.clearMortgage>>propertyMappers,
  [EventType.expense]: {
    minify: (notification) => ({
      ...baseMinifier(notification),
      a: notification.amount,
      ...(notification.source === EventSource.chanceCard ||
      notification.source === EventSource.communityChestCard
        ? { s: notification.source, ci: notification.cardId }
        : { s: notification.source }),
    }),
    restore: (e) => ({
      ...baseRestorer(e),
      amount: e.a,
      ...(e.s === EventSource.chanceCard || e.s === EventSource.communityChestCard
        ? { source: e.s, cardId: e.ci }
        : { source: e.s }),
    }),
  },
  [EventType.freeParking]: {
    minify: (notification) => ({ ...baseMinifier(notification), po: notification.pot }),
    restore: (e) => ({ ...baseRestorer(e), pot: e.po }),
  },
  [EventType.getOutOfJail]: {
    minify: (notification) => ({ ...baseMinifier(notification), m: notification.medium }),
    restore: (e) => ({ ...baseRestorer(e), medium: e.m }),
  },
  [EventType.goToJail]: {
    minify: (notification) => ({ ...baseMinifier(notification), s: notification.source }),
    restore: (e) => ({ ...baseRestorer(e), source: e.s }),
  },
  [EventType.mortgage]: <Mapper<EventType.mortgage>>propertyMappers,
  [EventType.passGo]: { minify: baseMinifier, restore: baseRestorer },
  [EventType.payRent]: {
    minify: (notification) => ({
      ...baseMinifier(notification),
      a: notification.amount,
      l: notification.landlordId,
    }),
    restore: (e) => ({ ...baseRestorer(e), amount: e.a, landlordId: e.l }),
  },
  [EventType.sellHouse]: <Mapper<EventType.sellHouse>>propertyMappers,
  [EventType.turnInJail]: {
    minify: (notification) => ({ ...baseMinifier(notification), tj: notification.turnsInJail }),
    restore: (e) => ({ ...baseRestorer(e), turnsInJail: e.tj }),
  },
};
