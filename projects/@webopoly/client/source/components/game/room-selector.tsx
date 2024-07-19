import React, { useEffect, useState } from 'react';
import { RoomState } from '../../../../core';
import { getGameIdParameter } from '../../url-params';
import { Button } from '../common/button';
import { Input } from '../common/input';
import { Paragraph } from '../common/paragraph';
import { GameMode } from './game-mode';

interface RoomSelectorProps {
  cancel: () => void;
  createRoom: () => void;
  gameMode: GameMode.peers | GameMode.server;
  joinRoom: (roomId: RoomState['id']) => void;
}

export const RoomSelector: React.FC<RoomSelectorProps> = (props) => {
  const [roomId, setRoomId] = useState('');

  const createRoomEnabled = !roomId;
  const joinRoomEnabled = !!roomId;

  useEffect(() => {
    const roomIdParam = getGameIdParameter(props.gameMode);
    if (roomIdParam) {
      setRoomId(roomIdParam);
      window.history.pushState({}, '', window.location.origin + window.location.pathname);
      props.joinRoom(roomIdParam);
    }
  }, []);

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
      <div style={{ position: 'absolute', top: 0, left: 8 }}>
        <Button onClick={props.cancel} type="transparent">
          ⬅️
        </Button>
      </div>

      <div style={{ marginBottom: 32 }}>
        <Button
          disabled={!createRoomEnabled}
          onClick={() => {
            if (createRoomEnabled) {
              props.createRoom();
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
              props.joinRoom(roomId);
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
