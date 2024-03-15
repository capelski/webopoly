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
  OnlineErrorCodes,
  RoomState,
  startGame,
  StringId,
  WSClientMessages,
  WSClientMessageType,
  WSServerMessageType,
  WSServerResponse,
} from '../../core';
import { Room, roomsRegister } from './rooms-register';
import { ServerSocket } from './server-socket';

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
  ): WSServerResponse[WSServerMessageType.roomEntered] | undefined {
    if (!playerName) {
      return;
    }

    const id = nanoid();
    const playerToken = nanoid();

    const room: Room = {
      game: undefined,
      id,
      players: [{ id: undefined, name: playerName, socket, token: playerToken }],
    };

    roomsRegister[id] = room;

    return {
      event: WSServerMessageType.roomEntered,
      data: {
        playerToken,
        roomState: roomToRoomState(room, playerToken),
      },
    };
  }

  @SubscribeMessage(WSClientMessageType.joinRoom)
  joinRoom(
    @MessageBody() { roomId, playerName }: WSClientMessages[WSClientMessageType.joinRoom],
    @ConnectedSocket() socket: ServerSocket,
  ):
    | WSServerResponse[WSServerMessageType.roomEntered]
    | WSServerResponse[WSServerMessageType.error]
    | undefined {
    if (!playerName || !roomId) {
      return;
    }

    const room = roomsRegister[roomId];
    if (!room) {
      return; // TODO Return informative errors instead of ignoring
    }

    if (room.game) {
      return {
        event: WSServerMessageType.error,
        data: { code: OnlineErrorCodes.GAME_ALREADY_STARTED },
      };
    }

    const duplicateName = room.players.find((p) => p.name === playerName);
    if (duplicateName) {
      return {
        event: WSServerMessageType.error,
        data: { code: OnlineErrorCodes.DUPLICATE_PLAYER_NAME },
      };
    }

    const playerToken = nanoid();
    room.players.push({
      socket,
      id: undefined,
      name: playerName,
      token: playerToken,
    });

    this.notifyPlayerChange(roomId, playerToken);

    return {
      event: WSServerMessageType.roomEntered,
      data: {
        playerToken,
        roomState: roomToRoomState(room, playerToken),
      },
    };
  }

  @SubscribeMessage(WSClientMessageType.retrieveRoom)
  retrieveRoom(
    @MessageBody() { roomId, playerToken }: WSClientMessages[WSClientMessageType.retrieveRoom],
    @ConnectedSocket() socket: ServerSocket,
  ): WSServerResponse[WSServerMessageType.roomRetrieved] | undefined {
    const room = roomsRegister[roomId];
    if (!room) {
      return;
    }

    const player = room.players.find((p) => p.token === playerToken);
    if (!player) {
      return;
    }

    player.socket = socket;

    return {
      event: WSServerMessageType.roomRetrieved,
      data: roomToRoomState(room, playerToken),
    };
  }

  @SubscribeMessage(WSClientMessageType.exitRoom)
  exitRoom(
    @MessageBody() { roomId, playerToken }: WSClientMessages[WSClientMessageType.exitRoom],
  ): WSServerResponse[WSServerMessageType.roomExited] | undefined {
    if (!playerToken || !roomId) {
      return;
    }

    const room = roomsRegister[roomId];
    if (!room) {
      return;
    }

    room.players = room.players.filter((player) => player.token !== playerToken);
    if (room.players.length > 0) {
      this.notifyPlayerChange(roomId, playerToken);
    } else {
      delete roomsRegister[roomId];
    }

    return {
      event: WSServerMessageType.roomExited,
      data: undefined,
    };
  }

  notifyPlayerChange(roomId: Room['id'], playerToken: StringId) {
    const room = roomsRegister[roomId];
    if (!room) {
      return;
    }

    room.players
      .filter((p) => p.token !== playerToken)
      .forEach((p) => {
        p.socket.emit(WSServerMessageType.playerChanged, roomToRoomState(room, p.token));
      });
  }

  @SubscribeMessage(WSClientMessageType.startGame)
  startGame(@MessageBody() roomId: WSClientMessages[WSClientMessageType.startGame]) {
    const room = roomsRegister[roomId];
    if (!room) {
      return;
    }

    const playerNames = room.players.map((player) => player.name);
    const game = startGame(playerNames);

    room.game = game;
    room.players.forEach((player, index) => {
      player.id = game.players[index].id;
    });

    room.players.forEach((p) => {
      p.socket.emit(WSServerMessageType.gameUpdated, game);
    });
  }

  // TODO Use playerToken to validate update
  // TODO Only allow change events instead of replacing the entire game
  @SubscribeMessage(WSClientMessageType.updateGame)
  updateGame(@MessageBody() { roomId, game }: WSClientMessages[WSClientMessageType.updateGame]) {
    const room = roomsRegister[roomId];
    if (!room) {
      return;
    }

    room.game = game;
    room.players.forEach((p) => {
      p.socket.emit(WSServerMessageType.gameUpdated, game);
    });
  }
}
