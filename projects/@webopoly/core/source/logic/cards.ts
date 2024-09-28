import { currencySymbol } from '../constants';
import { CardType, GamePhase, PropertyType, SquareType } from '../enums';
import { Card, Game, StreetSquare } from '../types';
import { getCurrentPlayer } from './game';
import { squaresMap } from './squares';

export const cards: Card[] = [
  /** Chance cards */
  {
    id: 1,
    squareId: 1,
    type: CardType.advance,
  },
  {
    id: 2,
    squareId: 25,
    type: CardType.advance,
  },
  {
    id: 3,
    squareId: 40,
    type: CardType.advance,
  },
  {
    id: 4,
    squareId: 12,
    type: CardType.advance,
  },
  {
    id: 5,
    propertyType: PropertyType.station,
    type: CardType.advanceNext,
  },
  {
    id: 6,
    propertyType: PropertyType.station,
    type: CardType.advanceNext,
  },
  {
    id: 7,
    propertyType: PropertyType.utility,
    type: CardType.advanceNext,
  },
  {
    amount: 50,
    id: 8,
    text: `Bank pays you dividend of ${currencySymbol}50`,
    type: CardType.windfall,
  },
  {
    id: 9,
    type: CardType.outOfJailCard,
  },
  {
    id: 10,
    type: CardType.goBackSpaces,
  },
  {
    id: 11,
    type: CardType.goToJail,
  },
  {
    housePrice: 25,
    id: 12,
    text: `Make general repairs on all your property. ${currencySymbol}25 per house`,
    type: CardType.streetRepairs,
  },
  {
    amount: 15,
    id: 13,
    text: `Speeding fine ${currencySymbol}15`,
    type: CardType.fee,
  },
  {
    id: 14,
    squareId: 6,
    type: CardType.advance,
  },
  {
    amount: 150,
    id: 15,
    text: `Your building loan matures. Collect ${currencySymbol}150`,
    type: CardType.windfall,
  },
  /** Community cards */
  {
    id: 16,
    squareId: 1,
    type: CardType.advance,
  },
  {
    amount: 200,
    id: 17,
    text: `Bank error in your favour. Collect ${currencySymbol}200`,
    type: CardType.windfall,
  },
  {
    amount: 50,
    id: 18,
    text: `Doctor's fee. Pay ${currencySymbol}50`,
    type: CardType.fee,
  },
  {
    amount: 50,
    id: 19,
    text: `From sale of stock you get ${currencySymbol}50`,
    type: CardType.windfall,
  },
  {
    id: 20,
    type: CardType.outOfJailCard,
  },
  {
    id: 21,
    type: CardType.goToJail,
  },
  {
    amount: 100,
    id: 22,
    text: `Holiday fund matures. Receive ${currencySymbol}100`,
    type: CardType.windfall,
  },
  {
    amount: 20,
    id: 23,
    text: `Income tax refund. Collect ${currencySymbol}20`,
    type: CardType.windfall,
  },
  {
    amount: 100,
    id: 24,
    text: `Life insurance matures. Collect ${currencySymbol}100`,
    type: CardType.windfall,
  },
  {
    amount: 100,
    id: 25,
    text: `Pay hospital fees of ${currencySymbol}100`,
    type: CardType.fee,
  },
  {
    amount: 50,
    id: 26,
    text: `Pay school fees of ${currencySymbol}50`,
    type: CardType.fee,
  },
  {
    amount: 25,
    id: 27,
    text: `Receive ${currencySymbol}25 consultancy fee`,
    type: CardType.windfall,
  },
  {
    housePrice: 40,
    id: 28,
    text: `You are assessed for street repairs. ${currencySymbol}40 per house`,
    type: CardType.streetRepairs,
  },
  {
    amount: 10,
    id: 29,
    text: `You have won second prize in a beauty contest. Collect ${currencySymbol}10`,
    type: CardType.windfall,
  },
  {
    amount: 100,
    id: 30,
    text: `You inherit ${currencySymbol}100`,
    type: CardType.windfall,
  },
];

export const cardsMap = cards.reduce<{ [id: Card['id']]: Card }>((reduced, card) => {
  return { ...reduced, [card.id]: card };
}, {});

type CardTextGetter<T extends CardType = CardType> = (
  card: Card<T>,
  amount: T extends CardType.streetRepairs ? number : undefined,
) => string;

const cardTextMap: { [TCard in CardType]: CardTextGetter<TCard> } = {
  [CardType.advance]: (card) => `Advance to ${squaresMap[card.squareId].name}`,
  [CardType.advanceNext]: (card) =>
    `Advance to the next ${card.propertyType === PropertyType.station ? 'Station' : 'Utility'}`,
  [CardType.fee]: (card) => card.text,
  [CardType.goBackSpaces]: () => 'Go back 3 spaces',
  [CardType.goToJail]: () => 'Go to Jail',
  [CardType.outOfJailCard]: () => 'Get Out of Jail Free',
  [CardType.streetRepairs]: (card, amount) => `${card.text} (${currencySymbol}${amount})`,
  [CardType.windfall]: (card) => card.text,
};

export const getCardAmount = (
  game: Game<GamePhase.applyCard> | Game<GamePhase.cannotPay> | Game<GamePhase.paymentLiquidation>,
  cardId: Card['id'],
): number => {
  const card = cardsMap[cardId];

  if (card.type === CardType.fee) {
    return card.amount;
  }

  if (card.type === CardType.streetRepairs) {
    const currentPlayer = getCurrentPlayer(game);
    const playerStreets = game.squares.filter(
      (s) =>
        s.type === SquareType.property &&
        s.propertyType === PropertyType.street &&
        s.ownerId === currentPlayer.id,
    ) as StreetSquare[];
    const houses = playerStreets.reduce((reduced, property) => reduced + property.houses, 0);

    return houses * card.housePrice;
  }

  return 0;
};

export const getCardText = (id: Card['id'], amount: number | undefined): string => {
  const card = cardsMap[id];
  const getter = cardTextMap[card.type] as CardTextGetter;
  return getter(card, amount);
};
