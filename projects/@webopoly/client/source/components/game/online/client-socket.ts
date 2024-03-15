import { Socket } from 'socket.io-client';
import { SocketHandlers, WSClientMessages, WSServerMessages } from '../../../../../core';

export type ClientSocket = Socket<
  SocketHandlers<WSServerMessages>,
  SocketHandlers<WSClientMessages>
>;

const logEvents = true;

export const socketEmit = <TKey extends keyof WSClientMessages>(
  socket: ClientSocket,
  event: TKey,
  data: WSClientMessages[TKey],
) => {
  if (logEvents) {
    console.log(`${event} received`, data);
  }

  (socket.emit as (event: TKey, data: WSClientMessages[TKey]) => void)(event, data);
};

export const socketListen = <TKey extends keyof WSServerMessages>(
  socket: ClientSocket,
  event: TKey,
  handler: (data: WSServerMessages[TKey]) => void,
) => {
  const handlerWrapper: any = (data: WSServerMessages[TKey]) => {
    if (logEvents) {
      console.log(`${event} received`, data);
    }
    handler(data);
  };
  socket.on(event, handlerWrapper);
};
