import { currencySymbol, passGoMoney } from '../parameters';
import { Card } from '../types';
import { shuffleArray } from './array';

// TODO Implement actions

const communityChestSource: Omit<Card, 'id'>[] = [
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
    text: `Bank error in your favour. Collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Doctor's fee. Pay ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `From sale of stock you get ${currencySymbol}50`,
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
    text: `Go to Jail. Go directly to jail, do not pass Go, do not collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Holiday fund matures. Receive ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Income tax refund. Collect ${currencySymbol}20`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `It is your birthday. Collect ${currencySymbol}10 from every player`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Life insurance matures. Collect ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Pay hospital fees of ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Pay school fees of ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `Receive ${currencySymbol}25 consultancy fee`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `You are assessed for street repairs. ${currencySymbol}40 per house. ${currencySymbol}115 per hotel`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `You have won second prize in a beauty contest. Collect ${currencySymbol}10`,
  },
  {
    action: (game) => {
      return game;
    },
    text: `You inherit ${currencySymbol}100`,
  },
];

const communityChestCards: Card[] = communityChestSource.map((card, index) => ({
  ...card,
  id: index + 1,
}));

let availableIds: number[] = [];

export const getCommunityChestCardById = (id: number): Card => {
  return communityChestCards.find((card) => card.id === id)!;
};

export const getNextCommunityChestCardId = (): number => {
  if (availableIds.length === 0) {
    availableIds = shuffleArray(communityChestCards.map((card) => card.id));
  }
  const nextId = availableIds.shift()!;
  return nextId;
};
