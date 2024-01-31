import { EventSource, EventType } from '../../enums';
import { EventMinified, GEvent, Id, PropertyEventType } from '../../types';

export type Minifier<T extends EventType = EventType> = (
  event: GEvent & { type: T },
) => EventMinified & { t: T };

export type Restorer<T extends EventType = EventType> = (
  e: EventMinified & { t: T },
) => GEvent & { type: T };

type Mapper<T extends EventType = EventType> = {
  minify: Minifier<T>;
  restore: Restorer<T>;
};

const baseMinifier = <T extends EventType>(event: GEvent & { type: T }): { p: Id; t: T } => ({
  p: event.playerId,
  t: event.type,
});

const baseRestorer = <T extends EventType>(e: { p: Id; t: T }): { playerId: Id; type: T } => ({
  playerId: e.p,
  type: e.t,
});

const propertyMappers: Mapper<PropertyEventType> = {
  minify: (event) => ({
    ...baseMinifier(event),
    pi: event.propertyId,
  }),
  restore: (e) => ({
    ...baseRestorer(e),
    propertyId: e.pi,
  }),
};

export const eventsMap: {
  [TKey in EventType]: Mapper<TKey>;
} = {
  [EventType.answerOffer]: {
    minify: (event) => ({
      ...baseMinifier(event),
      a: event.amount,
      an: event.answer,
      o: event.offerType,
      pi: event.propertyId,
      tp: event.targetPlayerId,
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
    minify: (event) => ({ ...baseMinifier(event), ci: event.creditorId }),
    restore: (e) => ({ ...baseRestorer(e), creditorId: e.ci }),
  },
  [EventType.buyProperty]: <Mapper<EventType.buyProperty>>propertyMappers,
  [EventType.buildHouse]: <Mapper<EventType.buildHouse>>propertyMappers,
  [EventType.card]: {
    minify: (event) => ({
      ...baseMinifier(event),
      ci: event.cardId,
      ct: event.cardType,
    }),
    restore: (e) => ({
      ...baseRestorer(e),
      cardId: e.ci,
      cardType: e.ct,
    }),
  },
  [EventType.clearMortgage]: <Mapper<EventType.clearMortgage>>propertyMappers,
  [EventType.expense]: {
    minify: (event) => ({
      ...baseMinifier(event),
      a: event.amount,
      ...(event.source === EventSource.chanceCard || event.source === EventSource.communityChestCard
        ? { s: event.source, ci: event.cardId }
        : { s: event.source }),
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
    minify: (event) => ({ ...baseMinifier(event), po: event.pot }),
    restore: (e) => ({ ...baseRestorer(e), pot: e.po }),
  },
  [EventType.getOutOfJail]: {
    minify: (event) => ({ ...baseMinifier(event), m: event.medium }),
    restore: (e) => ({ ...baseRestorer(e), medium: e.m }),
  },
  [EventType.goToJail]: {
    minify: (event) => ({ ...baseMinifier(event), s: event.source }),
    restore: (e) => ({ ...baseRestorer(e), source: e.s }),
  },
  [EventType.mortgage]: <Mapper<EventType.mortgage>>propertyMappers,
  [EventType.passGo]: { minify: baseMinifier, restore: baseRestorer },
  [EventType.payRent]: {
    minify: (event) => ({
      ...baseMinifier(event),
      a: event.amount,
      l: event.landlordId,
    }),
    restore: (e) => ({ ...baseRestorer(e), amount: e.a, landlordId: e.l }),
  },
  [EventType.sellHouse]: <Mapper<EventType.sellHouse>>propertyMappers,
  [EventType.turnInJail]: {
    minify: (event) => ({ ...baseMinifier(event), tj: event.turnsInJail }),
    restore: (e) => ({ ...baseRestorer(e), turnsInJail: e.tj }),
  },
};
