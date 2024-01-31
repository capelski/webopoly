import { EventSource, EventType } from '../../enums';
import { Id, Notification, NotificationMinified, PropertyNotificationType } from '../../types';

export type Minifier<T extends EventType = EventType> = (
  notification: Notification & { type: T },
) => NotificationMinified & { t: T };

export type Restorer<T extends EventType = EventType> = (
  n: NotificationMinified & { t: T },
) => Notification & { type: T };

type Mapper<T extends EventType = EventType> = {
  minify: Minifier<T>;
  restore: Restorer<T>;
};

const baseMinifier = <T extends EventType>(
  notification: Notification & { type: T },
): { p: Id; t: T } => ({ p: notification.playerId, t: notification.type });

const baseRestorer = <T extends EventType>(n: { p: Id; t: T }): { playerId: Id; type: T } => ({
  playerId: n.p,
  type: n.t,
});

const propertyMappers: Mapper<PropertyNotificationType> = {
  minify: (notification) => ({
    ...baseMinifier(notification),
    pi: notification.propertyId,
  }),
  restore: (n) => ({
    ...baseRestorer(n),
    propertyId: n.pi,
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
    restore: (n) => ({
      ...baseRestorer(n),
      answer: n.an,
      amount: n.a,
      offerType: n.o,
      propertyId: n.pi,
      targetPlayerId: n.tp,
    }),
  },
  [EventType.bankruptcy]: {
    minify: (notification) => ({ ...baseMinifier(notification), ci: notification.creditorId }),
    restore: (n) => ({ ...baseRestorer(n), creditorId: n.ci }),
  },
  [EventType.buyProperty]: <Mapper<EventType.buyProperty>>propertyMappers,
  [EventType.buildHouse]: <Mapper<EventType.buildHouse>>propertyMappers,
  [EventType.card]: {
    minify: (notification) => ({
      ...baseMinifier(notification),
      ci: notification.cardId,
      ct: notification.cardType,
    }),
    restore: (n) => ({
      ...baseRestorer(n),
      cardId: n.ci,
      cardType: n.ct,
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
    restore: (n) => ({
      ...baseRestorer(n),
      amount: n.a,
      ...(n.s === EventSource.chanceCard || n.s === EventSource.communityChestCard
        ? { source: n.s, cardId: n.ci }
        : { source: n.s }),
    }),
  },
  [EventType.freeParking]: {
    minify: (notification) => ({ ...baseMinifier(notification), po: notification.pot }),
    restore: (n) => ({ ...baseRestorer(n), pot: n.po }),
  },
  [EventType.getOutOfJail]: {
    minify: (notification) => ({ ...baseMinifier(notification), m: notification.medium }),
    restore: (n) => ({ ...baseRestorer(n), medium: n.m }),
  },
  [EventType.goToJail]: {
    minify: (notification) => ({ ...baseMinifier(notification), s: notification.source }),
    restore: (n) => ({ ...baseRestorer(n), source: n.s }),
  },
  [EventType.mortgage]: <Mapper<EventType.mortgage>>propertyMappers,
  [EventType.passGo]: { minify: baseMinifier, restore: baseRestorer },
  [EventType.payRent]: {
    minify: (notification) => ({
      ...baseMinifier(notification),
      a: notification.amount,
      l: notification.landlordId,
    }),
    restore: (n) => ({ ...baseRestorer(n), amount: n.a, landlordId: n.l }),
  },
  [EventType.sellHouse]: <Mapper<EventType.sellHouse>>propertyMappers,
  [EventType.turnInJail]: {
    minify: (notification) => ({ ...baseMinifier(notification), tj: notification.turnsInJail }),
    restore: (n) => ({ ...baseRestorer(n), turnsInJail: n.tj }),
  },
};
