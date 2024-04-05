import { RoomState, StringId } from '../../core';
import { Room } from './rooms-register';

export const roomToRoomState = (room: Room, playerToken: StringId): RoomState => {
  return {
    game: room.game,
    id: room.id,
    players: room.players.map((player) => ({
      id: player.id,
      isOwnPlayer: player.token === playerToken,
      name: player.name,
    })),
  };
};
