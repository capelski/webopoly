import {
  SocketHandlers,
  StringId,
  WSClientMessages,
  WSClientMessageType,
  WSServerMessages,
  WSServerMessageType,
} from '@webopoly/core';
import { Socket } from 'socket.io';
import { Room } from './rooms-register';
import { roomToRoomState } from './transformers';

export type ServerSocket = Socket<
  SocketHandlers<WSClientMessages>,
  SocketHandlers<WSServerMessages>
>;

const logEvents = true;

export const broadcastRoomUpdate = (room: Room, excludePlayerToken?: StringId) => {
  if (logEvents) {
    console.log(`${WSServerMessageType.roomUpdated} emitted`);
  }

  room.players
    .filter((p) => p.token !== excludePlayerToken)
    .forEach((p) => {
      p.socket.emit(WSServerMessageType.roomUpdated, roomToRoomState(room, p.token));
    });
};

export const messageReceived = <T extends WSClientMessageType>(
  messageType: T,
  data: WSClientMessages[T],
) => {
  if (logEvents) {
    console.log(`${messageType} received`, data);
  }
};

export const replyMessage = <T extends WSServerMessageType>(
  messageType: T,
  data: WSServerMessages[T],
) => {
  if (logEvents) {
    console.log(`${messageType} emitted`, data);
  }

  return { event: messageType, data };
};
