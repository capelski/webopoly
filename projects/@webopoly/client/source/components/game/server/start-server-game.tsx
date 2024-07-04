import React, { useEffect, useState } from 'react';
import { RoomState } from '../../../../../core';
import { gameIdQueryStringParameter } from '../../../parameters';
import { Button } from '../../common/button';
import { Paragraph } from '../../common/paragraph';

interface StartServerGameProps {
  exitRoom: () => void;
  room: RoomState;
  startGame: () => void;
}

export const StartServerGame: React.FC<StartServerGameProps> = (props) => {
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
              const url = new URL(window.location.origin);
              url.searchParams.append(gameIdQueryStringParameter, props.room.id);
              navigator.clipboard.writeText(url.toString());
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
