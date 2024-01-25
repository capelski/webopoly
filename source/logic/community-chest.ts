import { currencySymbol, passGoMoney } from '../parameters';
import { triggerMovePlayer } from '../triggers';
import { Card } from '../types';
import { shuffleArray } from './array';
import { payFee, payStreetRepairs, receiveFromAllPlayers, receivePayout } from './game';
import { squaresMap } from './game-minified/squares-map';
import { goToJail } from './player';

const communityChestSource: Omit<Card, 'id'>[] = [
  {
    action: (game) => {
      return triggerMovePlayer(game, 1);
    },
    text: `Advance to ${squaresMap[1].name}`,
  },
  {
    action: (game) => {
      return receivePayout(game, 200);
    },
    text: `Bank error in your favour. Collect ${currencySymbol}200`,
  },
  {
    action: (game) => {
      return payFee(game, 50);
    },
    text: `Doctor's fee. Pay ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return receivePayout(game, 50);
    },
    text: `From sale of stock you get ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return {
        ...game,
        players: game.players.map((p) => {
          return p.id === game.currentPlayerId ? { ...p, getOutOfJail: p.getOutOfJail + 1 } : p;
        }),
      };
    },
    text: 'Get Out of Jail Free',
  },
  {
    action: goToJail,
    text: `Go to Jail. If you pass Go, do not collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return receivePayout(game, 100);
    },
    text: `Holiday fund matures. Receive ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return receivePayout(game, 20);
    },
    text: `Income tax refund. Collect ${currencySymbol}20`,
  },
  {
    action: (game) => {
      return receiveFromAllPlayers(game, 10);
    },
    text: `It is your birthday. Collect ${currencySymbol}10 from every player`,
  },
  {
    action: (game) => {
      return receivePayout(game, 100);
    },
    text: `Life insurance matures. Collect ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return payFee(game, 100);
    },
    text: `Pay hospital fees of ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return payFee(game, 50);
    },
    text: `Pay school fees of ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return receivePayout(game, 25);
    },
    text: `Receive ${currencySymbol}25 consultancy fee`,
  },
  {
    action: (game) => {
      return payStreetRepairs(game, 40);
    },
    text: `You are assessed for street repairs: ${currencySymbol}40 per house`,
  },
  {
    action: (game) => {
      return receivePayout(game, 10);
    },
    text: `You have won second prize in a beauty contest. Collect ${currencySymbol}10`,
  },
  {
    action: (game) => {
      return receivePayout(game, 100);
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
