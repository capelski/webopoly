import { CardType, PropertyType } from '../enums';
import { Id } from './id';

export type Card<TCard extends CardType = CardType> = { id: Id } & (
  | {
      type: CardType.advance;
      squareId: Id;
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
