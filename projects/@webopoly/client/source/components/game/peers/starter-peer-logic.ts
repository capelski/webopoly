import { MessagingConnection } from '@easy-rtc/react';
import { startGame } from '../../../../../core';
import {
  PendingState,
  PlayerPending,
  PlayerPlaying,
  PlayingState,
  RemotePlayerPending,
  StarterPeerState,
} from './starter-peer-state';
import { WebRTCMessage } from './webrtc-message';
import { WebRTCMessageType } from './webrtc-message-type';
import { WebRTCRoom } from './webrtc-room';

export const broadcastRoomUpdate = (peerState: StarterPeerState) => {
  peerState.others
    .filter((other) => other.connection.isActive)
    .forEach((other) => {
      other.connection.sendMessage({
        type: WebRTCMessageType.roomUpdated,
        payload: getRoom(peerState, other),
      });
    });
};

export const getInitialState = (): PendingState => {
  return {
    game: undefined,
    others: [getNewPlayer(2)],
    self: { name: 'Player 1' },
  };
};

export const getNewPlayer = (playerNumber: number): RemotePlayerPending => {
  return {
    connection: new MessagingConnection<WebRTCMessage>({ minification: true }),
    name: `Player ${playerNumber}`,
  };
};

export const getPlayingState = (pendingState: PendingState): PlayingState => {
  const game = startGame([pendingState.self.name, ...pendingState.others.map((p) => p.name)]);

  return {
    game,
    others: pendingState.others.map((player, index) => ({
      ...player,
      id: game.players[index + 1].id,
    })),
    self: {
      id: game.players[0].id,
      name: pendingState.self.name,
    },
  };
};

const getRoom = (
  peerState: StarterPeerState,
  player: PlayerPending | PlayerPlaying,
): WebRTCRoom => {
  return peerState.game
    ? {
        game: peerState.game,
        players: [
          {
            ...peerState.self,
            isOwnPlayer: peerState.self === player,
          },
          ...peerState.others.map((other) => ({
            id: other.id,
            isOwnPlayer: other === player,
            name: other.name,
          })),
        ],
      }
    : {
        game: peerState.game,
        players: [
          {
            ...peerState.self,
            isOwnPlayer: peerState.self === player,
          },
          ...peerState.others
            .filter((other) => other.connection.isActive)
            .map((other) => ({
              isOwnPlayer: other === player,
              name: other.name,
            })),
        ],
      };
};

export const terminateAllConnections = (currentPeerState: StarterPeerState) => {
  currentPeerState.others
    .filter((other) => other.connection.isActive)
    .forEach((other) => {
      other.connection.closeConnection();
    });
};
