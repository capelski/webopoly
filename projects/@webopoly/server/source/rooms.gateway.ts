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
  Game,
  ServerErrorCodes,
  startGame,
  triggerRemovePlayer,
  triggerUpdate,
  WSClientMessages,
  WSClientMessageType,
  WSServerMessage,
  WSServerMessageType,
} from '../../core';
import { Room, roomsRegister } from './rooms-register';
import { broadcastRoomUpdate, messageReceived, replyMessage, ServerSocket } from './server-socket';
import { roomToRoomState } from './transformers';

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

    const id = nanoid();
    const playerToken = nanoid();

    const room: Room = {
      game: undefined,
      id,
      players: [{ id: undefined, name: 'Player 1', socket, token: playerToken }],
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

    const room = roomsRegister[data];
    if (!room) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.joinRoom,
        code: ServerErrorCodes.INVALID_ROOM_ID,
      });
    }

    if (room.game) {
      return replyMessage(WSServerMessageType.error, {
        code: ServerErrorCodes.GAME_ALREADY_STARTED,
        event: WSClientMessageType.joinRoom,
      });
    }

    const playerToken = nanoid();
    room.players.push({
      socket,
      id: undefined,
      name: `Player ${room.players.length + 1}`,
      token: playerToken,
    });

    broadcastRoomUpdate(room, playerToken);

    return replyMessage(WSServerMessageType.roomEntered, {
      playerToken,
      room: roomToRoomState(room, playerToken),
    });
  }

  @SubscribeMessage(WSClientMessageType.updatePlayerName)
  updatePlayerName(
    @MessageBody() data: WSClientMessages[WSClientMessageType.updatePlayerName],
  ): WSServerMessage[WSServerMessageType.error] | null {
    messageReceived(WSClientMessageType.updatePlayerName, data);

    const room = roomsRegister[data.roomId];
    if (!room) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.retrieveRoom,
        code: ServerErrorCodes.INVALID_ROOM_ID,
      });
    }

    const player = room.players.find((p) => p.token === data.playerToken);
    if (!player) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.retrieveRoom,
        code: ServerErrorCodes.INVALID_PLAYER_TOKEN,
      });
    }

    if (!data.playerName) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.joinRoom,
        code: ServerErrorCodes.MISSING_PLAYER_NAME,
      });
    }

    const duplicateName = room.players.find((p) => p.name === data.playerName);
    if (duplicateName) {
      return replyMessage(WSServerMessageType.error, {
        code: ServerErrorCodes.DUPLICATE_PLAYER_NAME,
        event: WSClientMessageType.joinRoom,
      });
    }

    player.name = data.playerName;

    broadcastRoomUpdate(room);

    return null;
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
        code: ServerErrorCodes.INVALID_ROOM_ID,
      });
    }

    const player = room.players.find((p) => p.token === data.playerToken);
    if (!player) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.retrieveRoom,
        code: ServerErrorCodes.INVALID_PLAYER_TOKEN,
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
        code: ServerErrorCodes.INVALID_ROOM_ID,
      });
    }

    const playerIndex = room.players.findIndex((player) => player.token === data.playerToken);
    if (playerIndex === -1) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.exitRoom,
        code: ServerErrorCodes.INVALID_PLAYER_TOKEN,
      });
    }

    const [player] = room.players.splice(playerIndex, 1);

    if (room.players.length > 0) {
      if (room.game && player.id) {
        room.game = triggerRemovePlayer(room.game, player.id);

        broadcastRoomUpdate(room, data.playerToken);

        /** Notifications will be immediately cleared in the client side; clearing them in the server as well */
        room.game.eventHistory = [...room.game.notifications.reverse(), ...room.game.eventHistory];
        room.game.notifications = [];
      } else {
        broadcastRoomUpdate(room, data.playerToken);
      }
    } else {
      delete roomsRegister[data.roomId];
    }

    return replyMessage(WSServerMessageType.roomExited, undefined);
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
        code: ServerErrorCodes.INVALID_ROOM_ID,
      });
    }

    const playerNames = room.players.map((player) => player.name);
    const game = startGame(playerNames);

    room.game = game;
    room.players.forEach((player, index) => {
      player.id = game.players[index].id;
    });

    broadcastRoomUpdate(room);

    return null;
  }

  @SubscribeMessage(WSClientMessageType.triggerUpdate)
  triggerUpdate(
    @MessageBody() data: WSClientMessages[WSClientMessageType.triggerUpdate],
  ): WSServerMessage[WSServerMessageType.error] | null {
    messageReceived(WSClientMessageType.triggerUpdate, data);

    const room = roomsRegister[data.roomId];
    if (!room) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.triggerUpdate,
        code: ServerErrorCodes.INVALID_ROOM_ID,
      });
    }

    const player = room.players.find((p) => p.token === data.playerToken);
    if (!player) {
      return replyMessage(WSServerMessageType.error, {
        event: WSClientMessageType.triggerUpdate,
        code: ServerErrorCodes.INVALID_PLAYER_TOKEN,
      });
    }

    if (!room.game || !player.id) {
      return null;
    }

    triggerUpdate(room.game, data.update, player.id, (updatedGame: Game) => {
      room.game = updatedGame;
      broadcastRoomUpdate(room);

      /** Notifications will be immediately cleared in the client side; clearing them in the server as well */
      updatedGame.eventHistory = [
        ...updatedGame.notifications.reverse(),
        ...updatedGame.eventHistory,
      ];
      updatedGame.notifications = [];
    });

    return null;
  }
}
