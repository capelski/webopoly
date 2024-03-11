import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Room, StringId } from '../../../../../core';
import { Button } from '../../common/button';
import { Paragraph } from '../../common/paragraph';
import { errorToast } from '../../common/toasts';

interface StartOnlineGameProps {
  gameStarted: () => void;
  playerToken: StringId;
  roomExited: () => void;
  roomId: Room['id'];
}

export const StartOnlineGame: React.FC<StartOnlineGameProps> = (props) => {
  const [room, setRoom] = useState<Room>();

  const exitRoom = async () => {
    await fetch('/api/rooms/exit', {
      body: JSON.stringify({ playerToken: props.playerToken, roomId: props.roomId }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    });

    props.roomExited();
  };

  const refreshRoom = async () => {
    const response = await fetch(`/api/rooms/${props.roomId}`);

    if (response.ok) {
      const nextRoom: Room = await response.json();

      if (nextRoom.game) {
        props.gameStarted();
      } else {
        setRoom(nextRoom);
      }
    } else {
      errorToast(`Error accessing the room "${props.roomId}"`);
    }
  };

  const startGame = async () => {
    const response = await fetch('/api/rooms/start', {
      body: JSON.stringify({ roomId: props.roomId }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'post',
    });

    if (response.ok) {
      props.gameStarted();
    } else {
      errorToast(`Error starting the game`);
    }
  };

  useEffect(() => {
    refreshRoom();
    const interval = setInterval(refreshRoom, 3000);

    return () => {
      clearInterval(interval);
    };
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
      <ToastContainer position="top-left" />

      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Paragraph style={{ fontWeight: 'bold' }}>Game id</Paragraph>
        <Paragraph>
          <span>{props.roomId}</span>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(props.roomId);
              toast(`"${props.roomId}" copied to clipboard`, { autoClose: 1000 });
            }}
            style={{ marginLeft: 8 }}
            type="secondary"
          >
            📎
          </Button>
        </Paragraph>
      </div>

      {room && (
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Paragraph style={{ fontWeight: 'bold' }}>Players</Paragraph>
          {room.players.map((player) => {
            return <Paragraph key={player.name}>{player.name}</Paragraph>;
          })}
        </div>
      )}

      <div>
        <Button disabled={!room || room.players.length < 2} onClick={startGame}>
          Start
        </Button>
        <Button onClick={exitRoom} type="delete">
          Exit
        </Button>
      </div>
    </div>
  );
};
