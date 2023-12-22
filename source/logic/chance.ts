import { currencySymbol, passGoMoney } from '../parameters';
import { Card } from '../types';
import { shuffleArray } from './array';

// TODO Implement actions

const chanceSource: Omit<Card, 'id'>[] = [
  {
    action: (game) => {
      return game;
    },
    text: `Advance to Go (Collect ${currencySymbol}${passGoMoney})`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Advance to Trafalgar Square. If you pass Go, collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return game;
    },
    text: 'Advance to Mayfair',
  },
  {
    action: (game) => {
      return game;
    },
    text: `Advance to Pall Mall. If you pass Go, collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return game;
    },
    text: 'Advance to the nearest Station. If unowned, you may buy it from the Bank. If owned, pay wonder twice the rental to which they are otherwise entitled',
  },
  {
    action: (game) => {
      return game;
    },
    text: 'Advance to the nearest Station. If unowned, you may buy it from the Bank. If owned, pay wonder twice the rental to which they are otherwise entitled',
  },
  {
    action: (game) => {
      return game;
    },
    text: 'Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total ten times amount thrown.',
  },
  {
    action: (game) => {
      return game;
    },
    text: `Bank pays you dividend of ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return game;
    },
    text: 'Get Out of Jail Free',
  },
  {
    action: (game) => {
      return game;
    },
    text: 'Go Back 3 Spaces',
  },
  {
    action: (game) => {
      return game;
    },
    text: `Go to Jail. Go directly to Jail, do not pass Go, do not collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Make general repairs on all your property. For each house pay ${currencySymbol}25. For each hotel pay ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Speeding fine ${currencySymbol}15`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Take a trip to Kings Cross Station. If you pass Go, collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `You have been elected Chairman of the Board. Pay each player ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Your building loan matures. Collect ${currencySymbol}150`,
  },
];

const chanceCards: Card[] = chanceSource.map((card, index) => ({
  ...card,
  id: index + 1,
}));

let availableIds: number[] = [];

export const getChanceCardById = (id: number): Card => {
  return chanceCards.find((card) => card.id === id)!;
};

export const getNextChanceCardId = (): number => {
  if (availableIds.length === 0) {
    availableIds = shuffleArray(chanceCards.map((card) => card.id));
  }
  const nextId = availableIds.shift()!;
  return nextId;
};
