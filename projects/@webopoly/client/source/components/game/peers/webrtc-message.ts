import { GameUpdate, Player } from '../../../../../core';
import { WebRTCMessageType } from './webrtc-message-type';
import { WebRTCRoom } from './webrtc-room';

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
      payload: WebRTCRoom;
    };
