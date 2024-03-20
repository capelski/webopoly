import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { nanoid } from 'nanoid';
import {
  clearNotifications,
  getCurrentPlayer,
  OnlineErrorCodes,
  RoomState,
  startGame,
  StringId,
  WSClientMessages,
  WSClientMessageType,
  WSServerMessage,
  WSServerMessageType,
} from '../../core';
import { Room, roomsRegister } from './rooms-register';
import { emitMessage, messageReceived, replyMessage, ServerSocket } from './server-socket';

const roomToRoomState = (room: Room, playerToken: StringId): RoomState => {
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

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:8080',
  },
  path: '/ws/socket.io',
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  handleConnection(client: ServerSocket) {
    console.log(`Client "${client.id}" connected`);
  }

  handleDisconnect(client: ServerSocket) {
    console.log(`Client "${client.id}" disconnected`);
  }

  @SubscribeMessage(WSClientMessageType.createRoom)
  createRoom(
    @MessageBody() playerName: WSClientMessages[WSClientMessageType.createRoom],
    @ConnectedSocket() socket: ServerSocket,
  ): WSServerMessage[WSServerMessageType.roomEntered] | WSServerMessage[WSServerMessageType.error] {
    messageReceived(WSClientMessageType.createRoom, playerName);

    if (!playerName) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.createRoom,
        code: OnlineErrorCodes.MISSING_PLAYER_NAME,
      });
    }

    const id = nanoid();
    const playerToken = nanoid();

    const room: Room = {
      game: undefined,
      id,
      players: [{ id: undefined, name: playerName, socket, token: playerToken }],
    };

    roomsRegister[id] = room;

    return replyMessage(WSServerMessageType.roomEntered, {
      playerToken,
      room: roomToRoomState(room, playerToken),
    });
  }

  @SubscribeMessage(WSClientMessageType.joinRoom)
  joinRoom(
    @MessageBody() data: WSClientMessages[WSClientMessageType.joinRoom],
    @ConnectedSocket() socket: ServerSocket,
  ): WSServerMessage[WSServerMessageType.roomEntered] | WSServerMessage[WSServerMessageType.error] {
    messageReceived(WSClientMessageType.joinRoom, data);

    if (!data.playerName) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.joinRoom,
        code: OnlineErrorCodes.MISSING_PLAYER_NAME,
      });
    }

    const room = roomsRegister[data.roomId];
    if (!room) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.joinRoom,
        code: OnlineErrorCodes.INVALID_ROOM_ID,
      });
    }

    if (room.game) {
      return replyMessage(WSServerMessageType.error, {
        code: OnlineErrorCodes.GAME_ALREADY_STARTED,
        event: WSClientMessageType.joinRoom,
      });
    }

    const duplicateName = room.players.find((p) => p.name === data.playerName);
    if (duplicateName) {
      return replyMessage(WSServerMessageType.error, {
        code: OnlineErrorCodes.DUPLICATE_PLAYER_NAME,
        event: WSClientMessageType.joinRoom,
      });
    }

    const playerToken = nanoid();
    room.players.push({
      socket,
      id: undefined,
      name: data.playerName,
      token: playerToken,
    });

    this.notifyPlayerChange(room, playerToken);

    return replyMessage(WSServerMessageType.roomEntered, {
      playerToken,
      room: roomToRoomState(room, playerToken),
    });
  }

  @SubscribeMessage(WSClientMessageType.retrieveRoom)
  retrieveRoom(
    @MessageBody() data: WSClientMessages[WSClientMessageType.retrieveRoom],
    @ConnectedSocket() socket: ServerSocket,
  ):
    | WSServerMessage[WSServerMessageType.roomRetrieved]
    | WSServerMessage[WSServerMessageType.error] {
    messageReceived(WSClientMessageType.retrieveRoom, data);

    const room = roomsRegister[data.roomId];
    if (!room) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.retrieveRoom,
        code: OnlineErrorCodes.INVALID_ROOM_ID,
      });
    }

    const player = room.players.find((p) => p.token === data.playerToken);
    if (!player) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.retrieveRoom,
        code: OnlineErrorCodes.INVALID_PLAYER_TOKEN,
      });
    }

    player.socket = socket;

    return replyMessage(WSServerMessageType.roomRetrieved, {
      playerToken: data.playerToken,
      room: roomToRoomState(room, data.playerToken),
    });
  }

  @SubscribeMessage(WSClientMessageType.exitRoom)
  exitRoom(
    @MessageBody() data: WSClientMessages[WSClientMessageType.exitRoom],
  ): WSServerMessage[WSServerMessageType.roomExited] | WSServerMessage[WSServerMessageType.error] {
    messageReceived(WSClientMessageType.exitRoom, data);
    const room = roomsRegister[data.roomId];
    if (!room) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.exitRoom,
        code: OnlineErrorCodes.INVALID_ROOM_ID,
      });
    }

    const playerIndex = room.players.findIndex((player) => player.token === data.playerToken);
    if (playerIndex === -1) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.exitRoom,
        code: OnlineErrorCodes.INVALID_PLAYER_TOKEN,
      });
    }

    room.players.splice(playerIndex, 1);
    if (room.players.length > 0) {
      this.notifyPlayerChange(room, data.playerToken);
    } else {
      delete roomsRegister[data.roomId];
    }

    return replyMessage(WSServerMessageType.roomExited, undefined);
  }

  notifyPlayerChange(room: Room, playerToken: StringId) {
    room.players
      .filter((p) => p.token !== playerToken)
      .forEach((p) => {
        emitMessage(WSServerMessageType.playerChanged, roomToRoomState(room, p.token), p.socket);
      });
  }

  @SubscribeMessage(WSClientMessageType.startGame)
  startGame(
    @MessageBody() roomId: WSClientMessages[WSClientMessageType.startGame],
  ): WSServerMessage[WSServerMessageType.error] | null {
    messageReceived(WSClientMessageType.startGame, roomId);

    const room = roomsRegister[roomId];
    if (!room) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.startGame,
        code: OnlineErrorCodes.INVALID_ROOM_ID,
      });
    }

    const playerNames = room.players.map((player) => player.name);
    const game = startGame(playerNames);

    room.game = game;
    room.players.forEach((player, index) => {
      player.id = game.players[index].id;
    });

    room.players.forEach((p) => {
      emitMessage(WSServerMessageType.gameUpdated, roomToRoomState(room, p.token), p.socket);
    });

    return null;
  }

  // TODO Do not allow clearing the game. Instead, exit the room.
  // TODO Only allow change events instead of replacing the entire game
  @SubscribeMessage(WSClientMessageType.updateGame)
  updateGame(
    @MessageBody() data: WSClientMessages[WSClientMessageType.updateGame],
  ): WSServerMessage[WSServerMessageType.error] | null {
    messageReceived(WSClientMessageType.updateGame, data);

    const room = roomsRegister[data.roomId];
    if (!room) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.updateGame,
        code: OnlineErrorCodes.INVALID_ROOM_ID,
      });
    }

    const player = room.players.find((p) => p.token === data.playerToken);
    if (!player) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.updateGame,
        code: OnlineErrorCodes.INVALID_PLAYER_TOKEN,
      });
    }

    if (!room.game) {
      return null;
    }

    const currentPlayer = getCurrentPlayer(room.game);
    if (data.game && player.id !== currentPlayer.id) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.updateGame,
        code: OnlineErrorCodes.NOT_YOUR_TURN,
      });
    }

    room.game = data.game;
    room.players.forEach((p) => {
      emitMessage(WSServerMessageType.gameUpdated, roomToRoomState(room, p.token), p.socket);
    });

    if (data.game) {
      /** Notifications will be immediately cleared in the client side; clear them in the server as well */
      room.game = clearNotifications(data.game);
    }

    return null;
  }
}
