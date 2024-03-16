import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { io } from 'socket.io-client';
import {
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

const PLAYER_ID_STORAGE_KEY = 'playerId';
const PLAYER_TOKEN_STORAGE_KEY = 'playerToken';
const ROOM_ID_STORAGE_KEY = 'roomId';

export type OnlineGameProps = {
  cancel: () => void;
};

export const OnlineGame: React.FC<OnlineGameProps> = (props) => {
  const [game, setGame] = useState<Game>();
  const [_, setPlayerId] = useState<Player['id']>();
  const [playerToken, setPlayerToken] = useState<StringId>();
  const [room, setRoom] = useState<RoomState>();
  const [socket, setSocket] = useState<ClientSocket>();

  const createRoom = (playerName: Player['name']) => {
    socket && socketEmit(socket, WSClientMessageType.createRoom, playerName);
  };

  const joinRoom = (playerName: Player['name'], _roomId: RoomState['id']) => {
    socket && socketEmit(socket, WSClientMessageType.joinRoom, { playerName, roomId: _roomId });
  };

  const exitRoom = async () => {
    playerToken &&
      room &&
      socket &&
      socketEmit(socket, WSClientMessageType.exitRoom, { playerToken, roomId: room.id });
  };

  const startGame = async () => {
    room && socket && socketEmit(socket, WSClientMessageType.startGame, room.id);
  };

  const updateGame = async (_game: Game | undefined) => {
    playerToken &&
      room &&
      socket &&
      socketEmit(socket, WSClientMessageType.updateGame, { roomId: room.id, game: _game });
  };

  useEffect(() => {
    const nextSocket: ClientSocket = io({ path: '/ws/socket.io' });

    nextSocket.on('connect', () => {
      console.log('Connected');

      const _playerToken = localStorage.getItem(PLAYER_TOKEN_STORAGE_KEY);
      const roomId = localStorage.getItem(ROOM_ID_STORAGE_KEY);

      if (_playerToken && roomId) {
        setPlayerToken(_playerToken);

        nextSocket.emit(WSClientMessageType.retrieveRoom, {
          playerToken: _playerToken,
          roomId,
        });
      }
    });

    socketListen(nextSocket, WSServerMessageType.roomEntered, (data) => {
      setPlayerToken(data.playerToken);
      setRoom(data.roomState);

      localStorage.setItem(PLAYER_TOKEN_STORAGE_KEY, data.playerToken);
      localStorage.setItem(ROOM_ID_STORAGE_KEY, data.roomState.id);
    });

    socketListen(nextSocket, WSServerMessageType.roomRetrieved, (data) => {
      setRoom(data);

      if (data.game) {
        const roomPlayer = data.players.find((p) => p.isOwnPlayer)!;

        setPlayerId(roomPlayer.id);
        setGame(data.game);
      }
    });

    socketListen(nextSocket, WSServerMessageType.playerChanged, setRoom);

    socketListen(nextSocket, WSServerMessageType.roomExited, () => {
      setPlayerId(undefined);
      setPlayerToken(undefined);
      setRoom(undefined);

      localStorage.removeItem(PLAYER_ID_STORAGE_KEY);
      localStorage.removeItem(PLAYER_TOKEN_STORAGE_KEY);
      localStorage.removeItem(ROOM_ID_STORAGE_KEY);
    });

    socketListen(nextSocket, WSServerMessageType.gameUpdated, setGame);

    socketListen(nextSocket, WSServerMessageType.error, (data) => {
      const errorMessage =
        data.code === OnlineErrorCodes.DUPLICATE_PLAYER_NAME
          ? 'Duplicate player name'
          : 'Game has already started';

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

      {game ? (
        <GameComponent game={game} updateGame={updateGame} />
      ) : room ? (
        <StartOnlineGame exitRoom={exitRoom} room={room} startGame={startGame} />
      ) : (
        <OnlineRoomSelector cancel={props.cancel} createRoom={createRoom} joinRoom={joinRoom} />
      )}
    </React.Fragment>
  );
};