import { Game, Player, StringId } from '@webopoly/core';
import { ServerSocket } from './server-socket';

export type Room = {
  game: Game<any> | undefined;
  id: StringId;
  players: {
    id: Player['id'] | undefined;
    name: Player['name'];
    socket: ServerSocket;
    token: StringId;
  }[];
};

export const roomsRegister: {
  [roomId: Room['id']]: Room;
} = {};
