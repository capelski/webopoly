import { Game } from './game';
import { StringId } from './id';
import { Player } from './player';

export type RoomState = {
  game: Game | undefined; // TODO Minify the game
  id: StringId;
  players: {
    id: Player['id'] | undefined;
    isOwnPlayer: boolean;
    name: Player['name'];
  }[];
};
