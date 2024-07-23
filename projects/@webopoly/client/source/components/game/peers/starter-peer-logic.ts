import { MessagingGroup } from '@easy-rtc/react';
import { startGame } from '@webopoly/core';
import {
  PendingState,
  PlayerPending,
  PlayerPlaying,
  PlayingState,
  StarterPeerState,
} from './starter-peer-state';
import { WebRTCMessage } from './webrtc-message';
import { WebRTCRoom } from './webrtc-room';

export const getInitialState = (): PendingState => {
  const messagingGroup = new MessagingGroup<WebRTCMessage, PlayerPending>({ minification: true });
  messagingGroup.addNode({ name: `Player 2` });

  return {
    game: undefined,
    messagingGroup,
    self: { name: 'Player 1' },
  };
};

export const getPlayingState = (pendingState: PendingState): PlayingState => {
  const game = startGame([
    pendingState.self.name,
    ...pendingState.messagingGroup.nodes.map(({ state }) => state.name),
  ]);

  const messagingGroup = MessagingGroup.from(
    pendingState.messagingGroup,
    (state, index): PlayerPlaying => ({
      ...state,
      id: game.players[index + 1].id,
    }),
  );

  return {
    game,
    messagingGroup,
    self: {
      id: game.players[0].id,
      name: pendingState.self.name,
    },
  };
};

export const getRoom = (
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
          ...peerState.messagingGroup.nodes.map(({ state }) => ({
            id: state.id,
            isOwnPlayer: state === player,
            name: state.name,
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
          ...peerState.messagingGroup.activeNodes.map(({ state }) => ({
            isOwnPlayer: state === player,
            name: state.name,
          })),
        ],
      };
};
