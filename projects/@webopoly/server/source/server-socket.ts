import { Socket } from 'socket.io';
import {
  SocketHandlers,
  WSClientMessages,
  WSClientMessageType,
  WSServerMessages,
  WSServerMessageType,
} from '../../core';

export type ServerSocket = Socket<
  SocketHandlers<WSClientMessages>,
  SocketHandlers<WSServerMessages>
>;

const logEvents = true;

export const emitMessage = <T extends WSServerMessageType>(
  messageType: T,
  data: WSServerMessages[T],
  socket: ServerSocket,
) => {
  if (logEvents) {
    console.log(`${messageType} emitted`, data);
  }

  (socket.emit as (event: T, data: WSServerMessages[T]) => void)(messageType, data);
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
