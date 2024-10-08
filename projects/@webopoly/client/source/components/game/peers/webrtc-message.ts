import { GameUpdate, Player } from '@webopoly/core';
import { WebRTCMessageType } from './webrtc-message-type';
import { WebRTCRoomStringified } from './webrtc-room';

export type WebRTCMessage =
  | {
      type: WebRTCMessageType.gameUpdate;
      payload: GameUpdate;
    }
  | {
      type: WebRTCMessageType.playerNameUpdate;
      payload: Player['name'];
    }
  | {
      type: WebRTCMessageType.roomUpdated;
      payload: WebRTCRoomStringified;
    };
