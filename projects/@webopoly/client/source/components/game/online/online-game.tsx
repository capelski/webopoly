import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import {
  clearNotifications,
  Game,
  OnlineErrorCodes,
  Player,
  RoomState,
  StringId,
  WSClientMessageType,
  WSServerMessageType,
} from '../../../../../core';
import { GameComponent } from '../game';
import { ClientSocket, socketEmit, socketListen } from './client-socket';
import { OnlineRoomSelector } from './online-room-selector';
import { StartOnlineGame } from './start-online-game';

const PLAYER_TOKEN_STORAGE_KEY = 'playerToken';
const ROOM_ID_STORAGE_KEY = 'roomId';

export type OnlineGameProps = {
  cancel: () => void;
};

export const OnlineGame: React.FC<OnlineGameProps> = (props) => {
  const [playerToken, setPlayerToken] = useState<StringId>();
  const [room, setRoom] = useState<RoomState>();
  const [socket, setSocket] = useState<ClientSocket>();

  const createRoom = (playerName: Player['name']) => {
    socket && socketEmit(socket, WSClientMessageType.createRoom, playerName);
  };

  const joinRoom = (playerName: Player['name'], _roomId: RoomState['id']) => {
    socket && socketEmit(socket, WSClientMessageType.joinRoom, { playerName, roomId: _roomId });
  };

  const exitRoom = () => {
    playerToken &&
      room &&
      socket &&
      socketEmit(socket, WSClientMessageType.exitRoom, { playerToken, roomId: room.id });
  };

  const startGame = () => {
    room && socket && socketEmit(socket, WSClientMessageType.startGame, room.id);
  };

  const clearNotificationsHandler = () => {
    if (room?.game) {
      setRoom({
        ...room,
        game: clearNotifications(room.game),
      });
    }
  };

  const updateGame = (game: Game) => {
    playerToken &&
      room &&
      socket &&
      socketEmit(socket, WSClientMessageType.updateGame, {
        game,
        playerToken,
        roomId: room.id,
      });
  };

  const exitGame = () => {
    // TODO Exit the room instead of clearing the game.

    playerToken &&
      room &&
      socket &&
      socketEmit(socket, WSClientMessageType.updateGame, {
        game: undefined,
        playerToken,
        roomId: room.id,
      });
  };

  const roomEntered = (_playerToken: StringId, _room: RoomState) => {
    setPlayerToken(_playerToken);
    setRoom(_room);
  };

  useEffect(() => {
    const nextSocket: ClientSocket = io({ path: '/ws/socket.io' });

    nextSocket.on('connect', () => {
      console.log('Connected');

      const _playerToken = localStorage.getItem(PLAYER_TOKEN_STORAGE_KEY);
      const roomId = localStorage.getItem(ROOM_ID_STORAGE_KEY);

      if (_playerToken && roomId) {
        nextSocket.emit(WSClientMessageType.retrieveRoom, {
          playerToken: _playerToken,
          roomId,
        });
      }
    });

    socketListen(nextSocket, WSServerMessageType.roomEntered, (data) => {
      roomEntered(data.playerToken, data.room);

      localStorage.setItem(PLAYER_TOKEN_STORAGE_KEY, data.playerToken);
      localStorage.setItem(ROOM_ID_STORAGE_KEY, data.room.id);
    });

    socketListen(nextSocket, WSServerMessageType.roomRetrieved, (data) => {
      roomEntered(data.playerToken, data.room);
    });

    socketListen(nextSocket, WSServerMessageType.playerChanged, setRoom);

    socketListen(nextSocket, WSServerMessageType.roomExited, () => {
      setPlayerToken(undefined);
      setRoom(undefined);

      localStorage.removeItem(PLAYER_TOKEN_STORAGE_KEY);
      localStorage.removeItem(ROOM_ID_STORAGE_KEY);
    });

    socketListen(nextSocket, WSServerMessageType.gameUpdated, setRoom);

    socketListen(nextSocket, WSServerMessageType.error, (data) => {
      const errorMessage =
        data.code === OnlineErrorCodes.DUPLICATE_PLAYER_NAME
          ? 'Duplicate player name'
          : data.code === OnlineErrorCodes.GAME_ALREADY_STARTED
          ? 'Game has already started'
          : data.code;

      toast(errorMessage, {
        type: 'error',
        autoClose: 3000,
      });
    });

    nextSocket.on('disconnect', () => {
      console.log('Disconnected');
    });

    setSocket(nextSocket);

    return () => {
      nextSocket.close();
    };
  }, []);

  return (
    <React.Fragment>
      <ToastContainer position="top-left" />

      {room && room.game ? (
        <GameComponent
          clearNotifications={clearNotificationsHandler}
          exitGame={exitGame}
          game={room.game}
          updateGame={updateGame}
          windowPlayerId={room.players.find((p) => p.isOwnPlayer)!.id!}
        />
      ) : room ? (
        <StartOnlineGame exitRoom={exitRoom} room={room} startGame={startGame} />
      ) : (
        <OnlineRoomSelector cancel={props.cancel} createRoom={createRoom} joinRoom={joinRoom} />
      )}
    </React.Fragment>
  );
};
