import { NotificationSource, NotificationType } from '../../enums';
import {
  GenericNotificationType,
  Id,
  Notification,
  NotificationMinified,
  PropertyNotificationType,
} from '../../types';

export type Minifier<T extends NotificationType = NotificationType> = (
  notification: Notification & { type: T },
) => NotificationMinified & { t: T };

export type Restorer<T extends NotificationType = NotificationType> = (
  n: NotificationMinified & { t: T },
) => Notification & { type: T };

type Mapper<T extends NotificationType = NotificationType> = {
  minify: Minifier<T>;
  restore: Restorer<T>;
};

const baseMinifier = <T extends NotificationType>(
  notification: Notification & { type: T },
): { p: Id; t: T } => ({ p: notification.playerId, t: notification.type });

const baseRestorer = <T extends NotificationType>(n: {
  p: Id;
  t: T;
}): { playerId: Id; type: T } => ({ playerId: n.p, type: n.t });

const genericMappers: Mapper<GenericNotificationType> = {
  minify: baseMinifier,
  restore: baseRestorer,
};

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
  [TKey in NotificationType]: Mapper<TKey>;
} = {
  [NotificationType.answerOffer]: {
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
  [NotificationType.bankruptcy]: <Mapper<NotificationType.bankruptcy>>genericMappers,
  [NotificationType.buyProperty]: <Mapper<NotificationType.buyProperty>>propertyMappers,
  [NotificationType.buildHouse]: <Mapper<NotificationType.buildHouse>>propertyMappers,
  [NotificationType.card]: {
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
  [NotificationType.clearMortgage]: <Mapper<NotificationType.clearMortgage>>propertyMappers,
  [NotificationType.expense]: {
    minify: (notification) => ({
      ...baseMinifier(notification),
      a: notification.amount,
      ...(notification.source === NotificationSource.chanceCard ||
      notification.source === NotificationSource.communityCard
        ? { s: notification.source, ci: notification.cardId }
        : { s: notification.source }),
    }),
    restore: (n) => ({
      ...baseRestorer(n),
      amount: n.a,
      ...(n.s === NotificationSource.chanceCard || n.s === NotificationSource.communityCard
        ? { source: n.s, cardId: n.ci }
        : { source: n.s }),
    }),
  },
  [NotificationType.freeParking]: {
    minify: (notification) => ({ ...baseMinifier(notification), po: notification.pot }),
    restore: (n) => ({ ...baseRestorer(n), pot: n.po }),
  },
  [NotificationType.getOutOfJail]: {
    minify: (notification) => ({ ...baseMinifier(notification), m: notification.medium }),
    restore: (n) => ({ ...baseRestorer(n), medium: n.m }),
  },
  [NotificationType.goToJail]: {
    minify: (notification) => ({ ...baseMinifier(notification), s: notification.source }),
    restore: (n) => ({ ...baseRestorer(n), source: n.s }),
  },
  [NotificationType.mortgage]: <Mapper<NotificationType.mortgage>>propertyMappers,
  [NotificationType.passGo]: <Mapper<NotificationType.passGo>>genericMappers,
  [NotificationType.payRent]: {
    minify: (notification) => ({
      ...baseMinifier(notification),
      l: notification.landlordId,
      r: notification.rent,
    }),
    restore: (n) => ({ ...baseRestorer(n), landlordId: n.l, rent: n.r }),
  },
  [NotificationType.sellHouse]: <Mapper<NotificationType.sellHouse>>propertyMappers,
  [NotificationType.turnInJail]: {
    minify: (notification) => ({ ...baseMinifier(notification), tj: notification.turnsInJail }),
    restore: (n) => ({ ...baseRestorer(n), turnsInJail: n.tj }),
  },
};
