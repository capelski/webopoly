import { WSClientMessageType } from '../enums';
import { Game } from './game';
import { StringId } from './id';
import { Player } from './player';
import { RoomState } from './room-state';

export type WSClientMessages = {
  [WSClientMessageType.createRoom]: Player['name'];
  [WSClientMessageType.exitRoom]: { playerToken: StringId; roomId: RoomState['id'] };
  [WSClientMessageType.joinRoom]: { playerName: Player['name']; roomId: RoomState['id'] };
  [WSClientMessageType.retrieveRoom]: { playerToken: StringId; roomId: RoomState['id'] };
  [WSClientMessageType.startGame]: RoomState['id'];
  [WSClientMessageType.updateGame]: {
    game: Game | undefined;
    playerToken: StringId;
    roomId: RoomState['id'];
  };
};
