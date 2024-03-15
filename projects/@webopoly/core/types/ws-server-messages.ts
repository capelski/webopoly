import { OnlineErrorCodes, WSServerMessageType } from '../enums';
import { Game } from './game';
import { StringId } from './id';
import { RoomState } from './room-state';

export type WSServerMessages = {
  [WSServerMessageType.error]: { code: OnlineErrorCodes };
  [WSServerMessageType.gameUpdated]: Game | undefined;
  [WSServerMessageType.playerChanged]: RoomState;
  [WSServerMessageType.roomEntered]: { playerToken: StringId; roomState: RoomState };
  [WSServerMessageType.roomExited]: undefined;
  [WSServerMessageType.roomRetrieved]: RoomState;
};

export type WSServerResponse<T = WSServerMessages> = {
  [TKey in keyof T]: { data: T[TKey]; event: TKey };
};
