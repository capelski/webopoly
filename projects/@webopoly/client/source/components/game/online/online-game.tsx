import React, { useEffect, useState } from 'react';
import { Game, Player, Room, RoomJoined, StringId } from '../../../../../core';
import { errorToast } from '../../common/toasts';
import { GameComponent } from '../game';
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
  const [_playerId, setPlayerId] = useState<Player['id']>();
  const [playerToken, setPlayerToken] = useState<StringId>();
  const [roomId, setRoomId] = useState<Room['id']>();

  const roomSelected = (roomJoined: RoomJoined) => {
    setPlayerToken(roomJoined.playerToken);
    setRoomId(roomJoined.roomId);

    localStorage.setItem(PLAYER_TOKEN_STORAGE_KEY, roomJoined.playerToken);
    localStorage.setItem(ROOM_ID_STORAGE_KEY, roomJoined.roomId);
  };

  const roomExited = () => {
    setPlayerId(undefined);
    setPlayerToken(undefined);
    setRoomId(undefined);

    localStorage.removeItem(PLAYER_ID_STORAGE_KEY);
    localStorage.removeItem(PLAYER_TOKEN_STORAGE_KEY);
    localStorage.removeItem(ROOM_ID_STORAGE_KEY);
  };

  const refreshGame = async (
    _roomId: Room['id'],
    _playerToken: StringId,
    _playerId: Player['id'] | undefined,
  ) => {
    try {
      if (!_playerId) {
        const playerIdResponse = await fetch(
          `/api/rooms/player-id?roomId=${_roomId}&playerToken=${_playerToken}`,
        );

        if (playerIdResponse.ok) {
          _playerId = await playerIdResponse.text();
          setPlayerId(_playerId);
          localStorage.setItem(PLAYER_ID_STORAGE_KEY, _playerId);
        } else {
          errorToast(`Error refreshing game "${_roomId}"`);
        }
      }

      if (_playerId) {
        const gameResponse = await fetch(`/api/games/${_roomId}`);
        if (gameResponse.ok) {
          const nextGame = await gameResponse.json();
          setGame(nextGame);
        } else {
          errorToast(`Error refreshing game "${_roomId}"`);
        }
      }
    } catch {
      errorToast(`Error refreshing game "${_roomId}"`);
    }
  };

  const gameStarted = async () => {
    if (roomId && playerToken) {
      await refreshGame(roomId, playerToken, undefined);
    }
  };

  const updateGame = async (_game: Game | undefined) => {
    // TODO
  };

  useEffect(() => {
    const playerId = localStorage.getItem(PLAYER_ID_STORAGE_KEY);
    const playerToken = localStorage.getItem(PLAYER_TOKEN_STORAGE_KEY);
    const roomId = localStorage.getItem(ROOM_ID_STORAGE_KEY);

    if (playerToken && roomId) {
      roomSelected({ playerToken, roomId });
      if (playerId) {
        setPlayerId(playerId);
        refreshGame(roomId, playerToken, playerId);
      }
    }
  }, []);

  return (
    <React.Fragment>
      {game ? (
        <GameComponent game={game} updateGame={updateGame} />
      ) : roomId && playerToken ? (
        <StartOnlineGame
          gameStarted={gameStarted}
          playerToken={playerToken}
          roomExited={roomExited}
          roomId={roomId}
        />
      ) : (
        <OnlineRoomSelector cancel={props.cancel} roomSelected={roomSelected} />
      )}
    </React.Fragment>
  );
};
