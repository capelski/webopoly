import { CardType, PropertyType } from '../enums';
import { NumberId } from './id';
import { Square } from './square';

export type Card<TCard extends CardType = CardType> = { id: NumberId } & (
  | {
      type: CardType.advance;
      squareId: Square['id'];
    }
  | {
      type: CardType.advanceNext;
      propertyType: PropertyType.station | PropertyType.utility;
    }
  | {
      amount: number;
      text: string;
      type: CardType.fee;
    }
  | {
      type: CardType.goBackSpaces;
    }
  | {
      type: CardType.goToJail;
    }
  | {
      type: CardType.outOfJailCard;
    }
  | {
      housePrice: number;
      text: string;
      type: CardType.streetRepairs;
    }
  | {
      amount: number;
      text: string;
      type: CardType.windfall;
    }
) & {
    type: TCard;
  };
