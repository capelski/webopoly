import { Player, RoomState } from '@webopoly/core';
import React from 'react';
import { serverGameIdQueryString } from '../../../parameters';
import { Button } from '../../common/button';
import { EditName } from '../../common/edit-name';
import { Paragraph } from '../../common/paragraph';
import { useClipboardAnimation } from '../../common/use-clipboard-animation';

interface StartServerGameProps {
  exitRoom: () => void;
  room: RoomState;
  startGame: () => void;
  updatePlayerName: (playerName: Player['name']) => void;
}

export const StartServerGame: React.FC<StartServerGameProps> = (props) => {
  const { animation, setAnimation } = useClipboardAnimation();

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
              const url = new URL(window.location.origin + window.location.pathname);
              url.searchParams.append(serverGameIdQueryString, props.room.id);
              navigator.clipboard.writeText(url.toString());
              setAnimation(true);
            }}
            style={{ marginLeft: 8 }}
            type="secondary"
          >
            {animation ? '✅' : '📎'}
          </Button>
        </Paragraph>
      </div>

      {props.room && (
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Paragraph style={{ fontWeight: 'bold' }}>Players</Paragraph>

          {props.room.players.map((player) => {
            return (
              <div key={player.name} style={{ alignItems: 'baseline', display: 'flex' }}>
                {player.isOwnPlayer ? (
                  <EditName playerName={player.name} updatePlayerName={props.updatePlayerName} />
                ) : (
                  <Paragraph>{player.name}</Paragraph>
                )}
              </div>
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
