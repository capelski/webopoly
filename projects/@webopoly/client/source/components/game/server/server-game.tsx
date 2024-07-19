import React, { useEffect, useMemo, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import {
  clearNotifications,
  GameUpdate,
  Player,
  RoomState,
  ServerErrorCodes,
  StringId,
  WSClientMessageType,
  WSServerMessageType,
} from '../../../../../core';
import { GameComponent } from '../game';
import { GameMode } from '../game-mode';
import { RoomSelector } from '../room-selector';
import { ClientSocket, socketEmit, socketListen } from './client-socket';
import { StartServerGame } from './start-server-game';

const PLAYER_TOKEN_STORAGE_KEY = 'playerToken';
const ROOM_ID_STORAGE_KEY = 'roomId';

export type ServerGameProps = {
  cancel: () => void;
};

export const ServerGame: React.FC<ServerGameProps> = (props) => {
  const [playerToken, setPlayerToken] = useState<StringId>();
  const [room, setRoom] = useState<RoomState>();
  const socket = useMemo<ClientSocket>(() => {
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

    socketListen(nextSocket, WSServerMessageType.roomExited, () => {
      setPlayerToken(undefined);
      setRoom(undefined);

      localStorage.removeItem(PLAYER_TOKEN_STORAGE_KEY);
      localStorage.removeItem(ROOM_ID_STORAGE_KEY);
    });

    socketListen(nextSocket, WSServerMessageType.roomUpdated, setRoom);

    socketListen(nextSocket, WSServerMessageType.error, (data) => {
      const errorMessage =
        data.code === ServerErrorCodes.DUPLICATE_PLAYER_NAME
          ? 'Duplicate player name'
          : data.code === ServerErrorCodes.GAME_ALREADY_STARTED
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

    return nextSocket;
  }, []);

  const windowPlayerId = room?.players.find((p) => p.isOwnPlayer)?.id;

  const createRoom = () => {
    socket && socketEmit(socket, WSClientMessageType.createRoom, undefined);
  };

  const joinRoom = (_roomId: RoomState['id']) => {
    console.log('socket', socket);
    socket && socketEmit(socket, WSClientMessageType.joinRoom, _roomId);
  };

  const updatePlayerName = (playerName: Player['name']) => {
    playerToken &&
      room &&
      socket &&
      socketEmit(socket, WSClientMessageType.updatePlayerName, {
        playerName,
        playerToken,
        roomId: room.id,
      });
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

  const triggerUpdate = (gameUpdate: GameUpdate) => {
    playerToken &&
      room &&
      socket &&
      socketEmit(socket, WSClientMessageType.triggerUpdate, {
        playerToken,
        roomId: room.id,
        update: gameUpdate,
      });
  };

  const roomEntered = (_playerToken: StringId, _room: RoomState) => {
    setPlayerToken(_playerToken);
    setRoom(_room);
  };

  useEffect(() => {
    return () => {
      socket.close();
    };
  }, []);

  return (
    <React.Fragment>
      <ToastContainer position="top-left" />

      {room && room.game && windowPlayerId ? (
        <GameComponent
          clearNotifications={clearNotificationsHandler}
          exitGame={exitRoom}
          game={room.game}
          triggerUpdate={triggerUpdate}
          windowPlayerId={windowPlayerId}
        />
      ) : room ? (
        <StartServerGame
          exitRoom={exitRoom}
          room={room}
          startGame={startGame}
          updatePlayerName={updatePlayerName}
        />
      ) : (
        <RoomSelector
          cancel={() => {
            localStorage.removeItem(PLAYER_TOKEN_STORAGE_KEY);
            localStorage.removeItem(ROOM_ID_STORAGE_KEY);
            props.cancel();
          }}
          createRoom={createRoom}
          gameMode={GameMode.server}
          joinRoom={joinRoom}
        />
      )}
    </React.Fragment>
  );
};
