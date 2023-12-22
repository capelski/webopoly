import { Game } from './game';

export type Card = {
  action: (game: Game) => Game;
  id: number;
  text: string;
};
