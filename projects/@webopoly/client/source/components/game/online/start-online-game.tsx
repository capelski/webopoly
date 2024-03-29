import React, { useEffect, useState } from 'react';
import { RoomState } from '../../../../../core';
import { Button } from '../../common/button';
import { Paragraph } from '../../common/paragraph';

interface StartOnlineGameProps {
  exitRoom: () => void;
  room: RoomState;
  startGame: () => void;
}

export const StartOnlineGame: React.FC<StartOnlineGameProps> = (props) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (copied) {
      timeout = setTimeout(() => {
        setCopied(false);
      }, 1000);
    }

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [copied]);

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
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Paragraph style={{ fontWeight: 'bold' }}>Game id</Paragraph>
        <Paragraph>
          <span>{props.room.id}</span>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(props.room.id);
              setCopied(true);
            }}
            style={{ marginLeft: 8 }}
            type="secondary"
          >
            {copied ? '✅' : '📎'}
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
