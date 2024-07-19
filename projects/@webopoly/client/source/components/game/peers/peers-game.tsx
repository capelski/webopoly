import { PeerMode } from '@easy-rtc/react';
import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { GameMode } from '../game-mode';
import { RoomSelector } from '../room-selector';
import { JoinerPeer } from './joiner-peer';
import { StarterPeer } from './starter-peer';

export type PeersGameProps = {
  cancel: () => void;
};

export const PeersGame: React.FC<PeersGameProps> = (props) => {
  const [peerMode, setPeerMode] = useState<PeerMode>();
  const [remotePeerData, setRemotePeerData] = useState('');

  return (
    <React.Fragment>
      <ToastContainer position="top-left" />

      {!peerMode ? (
        <RoomSelector
          cancel={() => {
            props.cancel();
          }}
          createRoom={() => {
            setPeerMode(PeerMode.starter);
          }}
          gameMode={GameMode.peers}
          joinRoom={(peerData) => {
            setPeerMode(PeerMode.joiner);
            setRemotePeerData(peerData);
          }}
        />
      ) : peerMode === PeerMode.starter ? (
        <StarterPeer
          exitRoom={() => {
            setPeerMode(undefined);
          }}
        />
      ) : (
        <JoinerPeer
          exitRoom={() => {
            setPeerMode(undefined);
            setRemotePeerData('');
          }}
          remotePeerData={remotePeerData}
        />
      )}
    </React.Fragment>
  );
};
