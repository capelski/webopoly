import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { RoomState } from '../../../../../core';
import { Button } from '../../common/button';
import { Paragraph } from '../../common/paragraph';

interface StartOnlineGameProps {
  exitRoom: () => void;
  room: RoomState;
  startGame: () => void;
}

export const StartOnlineGame: React.FC<StartOnlineGameProps> = (props) => {
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
          <span>{props.room.id}</span>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(props.room.id);
              toast(`"${props.room.id}" copied to clipboard`, { autoClose: 1000 });
            }}
            style={{ marginLeft: 8 }}
            type="secondary"
          >
            📎
          </Button>
        </Paragraph>
      </div>

      {props.room && (
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Paragraph style={{ fontWeight: 'bold' }}>Players</Paragraph>
          {props.room.players.map((player) => {
            return (
              <Paragraph key={player.name}>
                {player.name}
                {player.isOwnPlayer ? ' (You)' : ''}
              </Paragraph>
            );
          })}
        </div>
      )}

      <div>
        <Button disabled={!props.room || props.room.players.length < 2} onClick={props.startGame}>
          Start
        </Button>
        <Button onClick={props.exitRoom} type="delete">
          Exit
        </Button>
      </div>
    </div>
  );
};
