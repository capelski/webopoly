import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { OnlineErrorCodes, Player, Room, RoomJoined } from '../../../../../core';
import { Button } from '../../common/button';
import { Input } from '../../common/input';
import { Paragraph } from '../../common/paragraph';
import { errorToast } from '../../common/toasts';

interface OnlineRoomSelector {
  cancel: () => void;
  roomSelected: (roomJoined: RoomJoined) => void;
}

export const OnlineRoomSelector: React.FC<OnlineRoomSelector> = (props) => {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  const createRoomEnabled = playerName && playerName.length > 2 && !roomId;
  const joinRoomEnabled = playerName && playerName.length > 2 && !!roomId;

  const createRoom = async (playerName: Player['name']) => {
    try {
      const response = await fetch('/api/rooms/create', {
        body: JSON.stringify({ playerName }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
      });
      if (response.ok) {
        const roomJoined: RoomJoined = await response.json();
        props.roomSelected(roomJoined);
      } else {
        errorToast('An error occurred when creating the game');
      }
    } catch {
      errorToast('An error occurred when creating the game');
    }
  };

  const joinRoom = async (playerName: Player['name'], roomId: Room['id']) => {
    try {
      const response = await fetch('/api/rooms/join', {
        body: JSON.stringify({ roomId, playerName }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'post',
      });
      if (response.ok) {
        const roomJoined: RoomJoined = await response.json();
        props.roomSelected(roomJoined);
      } else {
        const error = await response.json();

        errorToast(
          error.code === OnlineErrorCodes.DUPLICATE_PLAYER_NAME
            ? `Player name "${playerName}" is already taken`
            : 'An error occurred when joining the room',
        );
      }
    } catch {
      errorToast('An error occurred when joining the game');
    }
  };

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100dvh',
      }}
    >
      <ToastContainer position="top-left" />

      <div style={{ position: 'absolute', top: 0, left: 8 }}>
        <Button onClick={props.cancel} type="transparent">
          ⬅️
        </Button>
      </div>

      <div style={{ borderBottom: '1px solid black', marginBottom: 32, paddingBottom: 32 }}>
        <Input
          onChange={(event) => {
            setPlayerName(event.target.value);
          }}
          placeholder="Player name"
          value={playerName}
        />
      </div>

      <div style={{ marginBottom: 32 }}>
        <Button
          disabled={!createRoomEnabled}
          onClick={() => {
            if (createRoomEnabled) {
              createRoom(playerName);
            }
          }}
          style={{
            animation: createRoomEnabled ? 'heart-beat-small 2s infinite' : undefined,
          }}
        >
          Create game
        </Button>
      </div>

      <div style={{ marginBottom: 32 }}>
        <Paragraph>OR</Paragraph>
      </div>

      <div>
        <Input
          onChange={(event) => {
            setRoomId(event.target.value);
          }}
          placeholder="Game id"
          value={roomId}
        />
      </div>

      <div>
        <Button
          disabled={!joinRoomEnabled}
          onClick={() => {
            if (joinRoomEnabled) {
              joinRoom(playerName, roomId);
            }
          }}
          style={{ animation: joinRoomEnabled ? 'heart-beat-small 2s infinite' : undefined }}
        >
          Join game
        </Button>
      </div>
    </div>
  );
};
