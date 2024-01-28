import { JailSource } from '../enums';
import { currencySymbol, passGoMoney } from '../parameters';
import {
  triggerGetOutOfJailCard,
  triggerGoToJail,
  triggerMovePlayer,
  triggerPayFee,
  triggerPayStreetRepairs,
  triggerReceiveFromAllPlayers,
  triggerReceivePayout,
} from '../triggers';
import { Card } from '../types';
import { squaresMap } from './minification/squares-map';

const communityChestSource: Omit<Card, 'id'>[] = [
  {
    action: (game) => {
      return triggerMovePlayer(game, 1);
    },
    text: `Advance to ${squaresMap[1].name}`,
  },
  {
    action: (game) => {
      return triggerReceivePayout(game, 200);
    },
    text: `Bank error in your favour. Collect ${currencySymbol}200`,
  },
  {
    action: (game) => {
      return triggerPayFee(game, 50);
    },
    text: `Doctor's fee. Pay ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return triggerReceivePayout(game, 50);
    },
    text: `From sale of stock you get ${currencySymbol}50`,
  },
  {
    action: triggerGetOutOfJailCard,
    text: 'Get Out of Jail Free',
  },
  {
    action: (game) => {
      return triggerGoToJail(game, JailSource.communityCard);
    },
    skipNotification: true,
    text: `Go to Jail. If you pass Go, do not collect ${currencySymbol}${passGoMoney}`,
  },
  {
    action: (game) => {
      return triggerReceivePayout(game, 100);
    },
    text: `Holiday fund matures. Receive ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return triggerReceivePayout(game, 20);
    },
    text: `Income tax refund. Collect ${currencySymbol}20`,
  },
  {
    action: (game) => {
      return triggerReceiveFromAllPlayers(game, 10);
    },
    text: `It is your birthday. Collect ${currencySymbol}10 from every player`,
  },
  {
    action: (game) => {
      return triggerReceivePayout(game, 100);
    },
    text: `Life insurance matures. Collect ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return triggerPayFee(game, 100);
    },
    text: `Pay hospital fees of ${currencySymbol}100`,
  },
  {
    action: (game) => {
      return triggerPayFee(game, 50);
    },
    text: `Pay school fees of ${currencySymbol}50`,
  },
  {
    action: (game) => {
      return triggerReceivePayout(game, 25);
    },
    text: `Receive ${currencySymbol}25 consultancy fee`,
  },
  {
    action: (game) => {
      return triggerPayStreetRepairs(game, 40);
    },
    text: `You are assessed for street repairs: ${currencySymbol}40 per house`,
  },
  {
    action: (game) => {
      return triggerReceivePayout(game, 10);
    },
    text: `You have won second prize in a beauty contest. Collect ${currencySymbol}10`,
  },
  {
    action: (game) => {
      return triggerReceivePayout(game, 100);
    },
    text: `You inherit ${currencySymbol}100`,
  },
];

export const communityChestCards: Card[] = communityChestSource.map((card, index) => ({
  ...card,
  id: index + 1,
}));

export const getCommunityChestCardById = (id: number): Card => {
  return communityChestCards.find((card) => card.id === id)!;
};
