import { CardType, PropertyType } from '../enums';
import { currencySymbol } from '../parameters';
import { Card, Id } from '../types';
import { squaresMap } from './minification/squares-map';

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

type CardTextGetter<T extends CardType = CardType> = (card: Card<T>) => string;

const cardTextMap: { [TCard in CardType]: CardTextGetter<TCard> } = {
  [CardType.advance]: (card) => `Advance to ${squaresMap[card.squareId].name}`,
  [CardType.advanceNext]: (card) =>
    `Advance to the next ${card.propertyType === PropertyType.station ? 'Station' : 'Utility'}`,
  [CardType.fee]: (card) => card.text,
  [CardType.goBackSpaces]: () => 'Go back 3 spaces',
  [CardType.goToJail]: () => 'Go to Jail',
  [CardType.outOfJailCard]: () => 'Get Out of Jail Free',
  [CardType.streetRepairs]: (card) => card.text,
  [CardType.windfall]: (card) => card.text,
};

export const getCardById = (id: Id): Card => {
  return cards.find((card) => card.id === id)!;
};

export const getCardText = (id: Id): string => {
  const card = getCardById(id);
  const getter: CardTextGetter = cardTextMap[card.type];
  return getter(card);
};
