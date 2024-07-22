import { MessagingConnection, MessagingGroup } from '@easy-rtc/react';
import { Game, Player } from '../../../../../core';
import { WebRTCMessage } from './webrtc-message';

export type PlayerPending = {
  name: string;
};

export type PlayerPlaying = PlayerPending & {
  id: Player['id'];
};

export type RemotePlayerPending = PlayerPending & {
  connection: MessagingConnection<WebRTCMessage>;
};

export type RemotePlayerPlaying = PlayerPlaying & {
  connection: MessagingConnection<WebRTCMessage>;
};

export type PendingState = {
  game?: undefined;
  messagingGroup: MessagingGroup<WebRTCMessage, PlayerPending>;
  self: PlayerPending;
};

export type PlayingState = {
  game: Game;
  messagingGroup: MessagingGroup<WebRTCMessage, PlayerPlaying>;
  self: PlayerPlaying;
};

export type StarterPeerState = PendingState | PlayingState;
