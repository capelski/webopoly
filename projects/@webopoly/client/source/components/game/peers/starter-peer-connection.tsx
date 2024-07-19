import { MessagingConnection, useMessagingConnection } from '@easy-rtc/react';
import React, { useEffect, useState } from 'react';
import { peersGameIdQueryString } from '../../../parameters';
import { Button } from '../../common/button';
import { Paragraph } from '../../common/paragraph';
import { useClipboardAnimation } from '../../common/use-clipboard-animation';
import { WebRTCMessage } from './webrtc-message';

export type ConnectionProps = {
  messagingConnection: MessagingConnection<WebRTCMessage>;
  playerName: string;
  removeConnection: () => void;
};

export const StarterPeerConnection: React.FC<ConnectionProps> = (props) => {
  const [remotePeerData, setRemotePeerData] = useState('');

  const { animation, setAnimation } = useClipboardAnimation();
  const connection = useMessagingConnection<WebRTCMessage>(props.messagingConnection);

  useEffect(() => {
    connection.startConnection();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Paragraph style={{ marginRight: 8 }}>{props.playerName}</Paragraph>
      {!connection.hasCompletedConnection && (
        <React.Fragment>
          <Button
            disabled={!connection.localPeerData}
            onClick={() => {
              const url = new URL(window.location.origin + window.location.pathname);
              url.searchParams.append(peersGameIdQueryString, connection.localPeerData);
              navigator.clipboard.writeText(url.toString());
              setAnimation(true);
            }}
            type="secondary"
          >
            {animation ? '✅' : '📎'}
          </Button>
          <input
            disabled={!connection.localPeerData}
            onChange={(event) => setRemotePeerData(event.target.value)}
            style={{ borderRadius: 4, marginRight: 8, marginTop: 8, padding: 12 }}
            value={remotePeerData}
          />
          <Button
            disabled={!connection.localPeerData}
            onClick={() => {
              connection.completeConnection(remotePeerData);
            }}
            type="secondary"
          >
            Verify
          </Button>
        </React.Fragment>
      )}
      <Button onClick={props.removeConnection} type="transparent">
        ❌
      </Button>
    </div>
  );
};
