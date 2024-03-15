import { Socket } from 'socket.io';
import { SocketHandlers, WSClientMessages, WSServerMessages } from '../../core';

export type ServerSocket = Socket<
  SocketHandlers<WSClientMessages>,
  SocketHandlers<WSServerMessages>
>;
