import { Game } from './game';
import { StringId } from './id';
import { Player } from './player';

export type InternalRoom = {
  game: Game | undefined;
  id: StringId;
  players: {
    id: Player['id'];
    name: Player['name'];
    token: StringId;
  }[];
};

/** Used to return the room information without revealing the private player tokens */
export type Room = {
  game: InternalRoom['game'];
  id: InternalRoom['id'];
  players: {
    id: Player['id'];
    name: Player['name'];
  }[];
};

/** Used to return the private tokens to players when joining a room */
export type RoomJoined = {
  playerToken: StringId;
  roomId: Room['id'];
};
