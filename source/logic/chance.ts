import { currencySymbol } from '../parameters';
import { Card } from '../types';
import { shuffleArray } from './array';
import { payFee, payStreetRepairs, payToAllPlayers, receivePayout } from './game';

const chanceSource: Omit<Card, 'id'>[] = [
  // {
  //   action: (game) => {
  //     return game;
  //   },
  //   text: `Advance to Go (Collect ${currencySymbol}${passGoMoney})`,
  // },
  // {
  //   action: (game) => {
  //     return game;
  //   },
  //   text: `Advance to Trafalgar Square. If you pass Go, collect ${currencySymbol}${passGoMoney}`,
  // },
  // {
  //   action: (game) => {
  //     return game;
  //   },
  //   text: 'Advance to Mayfair',
  // },
  // {
  //   action: (game) => {
  //     return game;
  //   },
  //   text: `Advance to Pall Mall. If you pass Go, collect ${currencySymbol}${passGoMoney}`,
  // },
  // {
  //   action: (game) => {
  //     return game;
  //   },
  //   text: 'Advance to the next Station. If owned, pay the owner double rental',
  // },
  // {
  //   action: (game) => {
  //     return game;
  //   },
  //   text: 'Advance to the next Station. If owned, pay the owner double rental',
  // },
  // {
  //   action: (game) => {
  //     return game;
  //   },
  //   text: 'Advance token to next Utility. If owned, throw the dice and pay the owner 10 times the amount thrown',
  // },
  {
    action: (game) => {
      return receivePayout(game, 50);
    },
    text: `Bank pays you dividend of ${currencySymbol}50`,
  },
  // {
  //   action: (game) => {
  //     return game;
  //   },
  //   text: 'Get Out of Jail Free',
  // },
  // {
  //   action: (game) => {
  //     return game;
  //   },
  //   text: 'Go Back 3 Spaces',
  // },
  // {
  //   action: (game) => {
  //     return game;
  //   },
  //   text: `Go to Jail. Go directly to Jail, do not pass Go, do not collect ${currencySymbol}${passGoMoney}`,
  // },
  {
    action: (game) => {
      return payStreetRepairs(game, 25);
    },
    text: `Make general repairs on all your property: pay ${currencySymbol}25 for each house`,
  },
  {
    action: (game) => {
      return payFee(game, 15);
    },
    text: `Speeding fine ${currencySymbol}15`,
  },
  // {
  //   action: (game) => {
  //     return game;
  //   },
  //   text: `Take a trip to Kings Cross Station. If you pass Go, collect ${currencySymbol}${passGoMoney}`,
  // },
  {
    action: (game) => {
      return payToAllPlayers(game, 50);
    },
    text: `You have been elected Chairman of the Board. Pay each player ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return receivePayout(game, 150);
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
