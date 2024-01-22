import { NotificationType } from '../../enums';
import {
  GenericNotification,
  GenericNotificationMinified,
  GenericNotificationType,
  Notification,
  NotificationMinified,
  PropertyNotification,
  PropertyNotificationMinified,
  PropertyNotificationType,
} from '../../types';

export type Minifier<T = NotificationType> = (
  notification: Notification & { type: T },
) => NotificationMinified & { t: T };

export type Restorer<T = NotificationType> = (
  n: NotificationMinified & { t: T },
) => Notification & { type: T };

const genericMinifier = <T extends GenericNotificationType>(
  notification: GenericNotification & { type: T },
): GenericNotificationMinified & { t: T } => ({ p: notification.playerId, t: notification.type });

const genericRestorer = <T extends GenericNotificationType>(
  n: GenericNotificationMinified & { t: T },
): GenericNotification & { type: T } => ({ playerId: n.p, type: n.t });

const propertyMinifier = <T extends PropertyNotificationType>(
  notification: PropertyNotification & { type: T },
): PropertyNotificationMinified & { t: T } => ({
  p: notification.playerId,
  pi: notification.propertyId,
  t: notification.type,
});

const propertyRestorer = <T extends PropertyNotificationType>(
  n: PropertyNotificationMinified & { t: T },
): PropertyNotification & { type: T } => ({ playerId: n.p, propertyId: n.pi, type: n.t });

export const notificationsMap: {
  [TKey in NotificationType]: { minify: Minifier<TKey>; restore: Restorer<TKey> };
} = {
  [NotificationType.answerOffer]: {
    minify: (notification) => ({
      a: notification.amount,
      an: notification.answer,
      o: notification.offerType,
      p: notification.playerId,
      pi: notification.propertyId,
      tp: notification.targetPlayerId,
      t: notification.type,
    }),
    restore: (n) => ({
      answer: n.an,
      amount: n.a,
      offerType: n.o,
      playerId: n.p,
      propertyId: n.pi,
      targetPlayerId: n.tp,
      type: n.t,
    }),
  },
  [NotificationType.bankruptcy]: { minify: genericMinifier, restore: genericRestorer },
  [NotificationType.buyProperty]: { minify: propertyMinifier, restore: propertyRestorer },
  [NotificationType.buildHouse]: { minify: propertyMinifier, restore: propertyRestorer },
  [NotificationType.chance]: {
    minify: (notification) => ({
      c: notification.cardId,
      p: notification.playerId,
      t: notification.type,
    }),
    restore: (n) => ({ cardId: n.c, playerId: n.p, type: n.t }),
  },
  [NotificationType.clearMortgage]: { minify: propertyMinifier, restore: propertyRestorer },
  [NotificationType.communityChest]: {
    minify: (notification) => ({
      c: notification.cardId,
      p: notification.playerId,
      t: notification.type,
    }),
    restore: (n) => ({ cardId: n.c, playerId: n.p, type: n.t }),
  },
  [NotificationType.freeParking]: {
    minify: (notification) => ({
      p: notification.playerId,
      po: notification.pot,
      t: notification.type,
    }),
    restore: (n) => ({ playerId: n.p, pot: n.po, type: n.t }),
  },
  [NotificationType.getOutOfJail]: { minify: genericMinifier, restore: genericRestorer },
  [NotificationType.goToJail]: { minify: genericMinifier, restore: genericRestorer },
  [NotificationType.mortgage]: { minify: propertyMinifier, restore: propertyRestorer },
  [NotificationType.passGo]: { minify: genericMinifier, restore: genericRestorer },
  [NotificationType.payRent]: {
    minify: (notification) => ({
      l: notification.landlordId,
      p: notification.playerId,
      r: notification.rent,
      t: notification.type,
    }),
    restore: (n) => ({ landlordId: n.l, playerId: n.p, rent: n.r, type: n.t }),
  },
  [NotificationType.payTax]: {
    minify: (notification) => ({
      p: notification.playerId,
      ta: notification.tax,
      t: notification.type,
    }),
    restore: (e) => ({ playerId: e.p, tax: e.ta, type: e.t }),
  },
  [NotificationType.remainInJail]: {
    minify: (notification) => ({
      p: notification.playerId,
      tj: notification.turnsInJail,
      t: notification.type,
    }),
    restore: (n) => ({ playerId: n.p, turnsInJail: n.tj, type: n.t }),
  },
  [NotificationType.sellHouse]: { minify: propertyMinifier, restore: propertyRestorer },
};
