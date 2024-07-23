import { WSClientMessageType } from '../enums';
import { GameUpdate } from './game-update';
import { StringId } from './id';
import { Player } from './player';
import { RoomState } from './room-state';

export type WSClientMessages = {
  [WSClientMessageType.createRoom]: undefined;
  [WSClientMessageType.exitRoom]: { playerToken: StringId; roomId: RoomState['id'] };
  [WSClientMessageType.joinRoom]: RoomState['id'];
  [WSClientMessageType.retrieveRoom]: { playerToken: StringId; roomId: RoomState['id'] };
  [WSClientMessageType.startGame]: RoomState['id'];
  [WSClientMessageType.triggerUpdate]: {
    playerToken: StringId;
    roomId: RoomState['id'];
    update: GameUpdate;
  };
  [WSClientMessageType.updatePlayerName]: {
    playerName: Player['name'];
    playerToken: StringId;
    roomId: RoomState['id'];
  };
};
