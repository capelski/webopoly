import React, { useEffect, useState } from 'react';
import { Player, RoomState } from '../../../../../core';
import { getGameIdParameter } from '../../../url-params';
import { Button } from '../../common/button';
import { Input } from '../../common/input';
import { Paragraph } from '../../common/paragraph';

interface ServerRoomSelectorProps {
  cancel: () => void;
  createRoom: (playerName: Player['name']) => void;
  joinRoom: (playerName: Player['name'], roomId: RoomState['id']) => void;
}

export const ServerRoomSelector: React.FC<ServerRoomSelectorProps> = (props) => {
  const [roomId, setRoomId] = useState('');
  const [playerName, setPlayerName] = useState('');

  const createRoomEnabled = playerName && playerName.length > 2 && !roomId;
  const joinRoomEnabled = playerName && playerName.length > 2 && !!roomId;

  useEffect(() => {
    const roomIdParam = getGameIdParameter();
    if (roomIdParam) {
      setRoomId(roomIdParam);
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
              props.createRoom(playerName);
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
              props.joinRoom(playerName, roomId);
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
