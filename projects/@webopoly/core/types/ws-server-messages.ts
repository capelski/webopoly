import { OnlineErrorCodes, WSClientMessageType, WSServerMessageType } from '../enums';
import { StringId } from './id';
import { RoomState } from './room-state';

export type WSServerMessages = {
  [WSServerMessageType.error]: { code: OnlineErrorCodes; event: WSClientMessageType };
  [WSServerMessageType.gameUpdated]: RoomState;
  [WSServerMessageType.playerChanged]: RoomState;
  [WSServerMessageType.roomEntered]: { playerToken: StringId; room: RoomState };
  [WSServerMessageType.roomExited]: undefined;
  [WSServerMessageType.roomRetrieved]: { playerToken: StringId; room: RoomState };
};

export type WSServerMessage<T = WSServerMessages> = {
  [TKey in keyof T]: { data: T[TKey]; event: TKey };
};
