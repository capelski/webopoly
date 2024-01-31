import { Game } from './game';
import { Id } from './id';

export type Card = {
  action: (game: Game) => Game;
  id: Id;
  skipEvent?: boolean;
  text: string;
};
