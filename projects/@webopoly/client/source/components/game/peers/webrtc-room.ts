import { Game, Player } from '../../../../../core';

export type RoomPlayerPending = {
  isOwnPlayer: boolean;
  name: Player['name'];
};

export type RoomPlayerPlaying = RoomPlayerPending & {
  id: Player['id'];
};

export type WebRTCRoom = WebRTCRoomPending | WebRTCRoomPlaying;

export type WebRTCRoomPending = {
  game?: undefined;
  players: RoomPlayerPending[];
};

export type WebRTCRoomPlaying = {
  game: Game;
  players: RoomPlayerPlaying[];
};
