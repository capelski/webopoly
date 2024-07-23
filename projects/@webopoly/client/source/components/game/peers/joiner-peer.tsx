import { useMessagingConnection } from '@easy-rtc/react';
import { clearNotifications, GameUpdate } from '@webopoly/core';
import React, { useEffect, useState } from 'react';
import { Button } from '../../common/button';
import { EditName } from '../../common/edit-name';
import { Paragraph } from '../../common/paragraph';
import { useClipboardAnimation } from '../../common/use-clipboard-animation';
import { GameComponent } from '../game';
import { WebRTCMessage } from './webrtc-message';
import { WebRTCMessageType } from './webrtc-message-type';
import { WebRTCRoom } from './webrtc-room';

interface JoinerPeerProps {
  exitRoom: () => void;
  remotePeerData: string;
}

export const JoinerPeer: React.FC<JoinerPeerProps> = (props) => {
  const [room, setRoom] = useState<WebRTCRoom>();

  const connection = useMessagingConnection<WebRTCMessage>({ minification: true });

  connection.on('messageReceived', (message) => {
    if (message.type === WebRTCMessageType.roomUpdated) {
      setRoom(message.payload);
      // TODO For better UX animation, do not listen to player movement events and compute in this peer
    }
  });

  connection.on('connectionClosed', props.exitRoom);

  const windowPlayerId = room && room.game && room.players.find((p) => p.isOwnPlayer)?.id;

  const { animation, setAnimation } = useClipboardAnimation();

  useEffect(() => {
    connection.joinConnection(props.remotePeerData);

    const onWindowClose = (event: Event) => {
      event.preventDefault();
      connection.closeConnection();
    };

    window.addEventListener('unload', onWindowClose);
    return () => {
      window.removeEventListener('unload', onWindowClose);
    };
  }, []);

  const exitRoom = () => {
    connection.closeConnection();
    props.exitRoom();
  };

  return room?.game && windowPlayerId ? (
    <GameComponent
      clearNotifications={() => {
        setRoom({ ...room, game: clearNotifications(room.game) });
      }}
      exitGame={exitRoom}
      game={room.game}
      triggerUpdate={(gameUpdate: GameUpdate) => {
        connection.sendMessage({
          type: WebRTCMessageType.gameUpdate,
          payload: gameUpdate,
        });
      }}
      windowPlayerId={windowPlayerId}
    />
  ) : (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100dvh',
      }}
    >
      {room && (
        <div style={{ marginBottom: 32 }}>
          <Paragraph style={{ fontWeight: 'bold' }}>Players</Paragraph>
          {room.players.map((player, index) => {
            return player.isOwnPlayer ? (
              <EditName
                key={index}
                playerName={player.name}
                updatePlayerName={(playerName) => {
                  connection.sendMessage({
                    type: WebRTCMessageType.playerNameUpdate,
                    payload: playerName,
                  });
                }}
              />
            ) : (
              <Paragraph key={index}>{player.name}</Paragraph>
            );
          })}
        </div>
      )}

      <div>
        {!room && (
          <Button
            onClick={() => {
              navigator.clipboard.writeText(connection.localPeerData);
              setAnimation(true);
            }}
            style={{ marginLeft: 8 }}
            type="border"
          >
            Copy verification code{animation ? ' ✅' : undefined}
          </Button>
        )}
        <Button onClick={exitRoom} type="delete">
          Exit
        </Button>
      </div>

      <div>
        <p style={{ margin: 8, padding: 8 }}>
          🛜 If a player is using a private network (e.g. a WiFi connection) the other player needs
          to use the same private network
        </p>
      </div>
    </div>
  );
};
