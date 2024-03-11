import { IsString } from 'class-validator';
import { Player, Room, StringId } from '../../core';

export class CreateRoomBody {
  @IsString()
  playerName: Player['name'];
}

export class ExitRoomBody {
  @IsString()
  roomId: Room['id'];

  @IsString()
  playerToken: StringId;
}

export class JoinRoomBody extends CreateRoomBody {
  @IsString()
  roomId: Room['id'];
}

export class StartGameBody {
  @IsString()
  roomId: StringId;
}
