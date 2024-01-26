import { NotificationType } from '../../enums';
import {
  CardNotificationType,
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

const cardMappers: Mapper<CardNotificationType> = {
  minify: (notification) => ({
    ...baseMinifier(notification),
    c: notification.cardId,
  }),
  restore: (n) => ({
    ...baseRestorer(n),
    cardId: n.c,
  }),
};

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
  [NotificationType.chance]: <Mapper<NotificationType.chance>>cardMappers,
  [NotificationType.clearMortgage]: <Mapper<NotificationType.clearMortgage>>propertyMappers,
  [NotificationType.communityChest]: <Mapper<NotificationType.communityChest>>cardMappers,
  [NotificationType.freeParking]: {
    minify: (notification) => ({ ...baseMinifier(notification), po: notification.pot }),
    restore: (n) => ({ ...baseRestorer(n), pot: n.po }),
  },
  [NotificationType.getOutOfJail]: {
    minify: (notification) => ({ ...baseMinifier(notification), m: notification.medium }),
    restore: (n) => ({ ...baseRestorer(n), medium: n.m }),
  },
  [NotificationType.goToJail]: <Mapper<NotificationType.goToJail>>genericMappers,
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
  [NotificationType.payTax]: {
    minify: (notification) => ({ ...baseMinifier(notification), ta: notification.tax }),
    restore: (n) => ({ ...baseRestorer(n), tax: n.ta }),
  },
  [NotificationType.sellHouse]: <Mapper<NotificationType.sellHouse>>propertyMappers,
  [NotificationType.turnInJail]: {
    minify: (notification) => ({ ...baseMinifier(notification), tj: notification.turnsInJail }),
    restore: (n) => ({ ...baseRestorer(n), turnsInJail: n.tj }),
  },
};
