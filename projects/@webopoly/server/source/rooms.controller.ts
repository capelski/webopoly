import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { nanoid } from 'nanoid';
import {
  InternalRoom,
  OnlineErrorCodes,
  Player,
  Room,
  RoomJoined,
  startGame,
  StringId,
} from '../../core';
import { CreateRoomBody, ExitRoomBody, JoinRoomBody, StartGameBody } from './rooms.dtos';

export const roomsRegister: {
  [roomId: InternalRoom['id']]: InternalRoom;
} = {};

@Controller('/rooms')
export class RoomsController {
  @Post('/create')
  createRoom(@Body() { playerName }: CreateRoomBody): RoomJoined {
    const id = nanoid();
    const playerToken = nanoid();

    const internalRoom: InternalRoom = {
      game: undefined,
      id,
      players: [{ id: `-1`, name: playerName, token: playerToken }],
    };

    roomsRegister[id] = internalRoom;

    return { playerToken, roomId: internalRoom.id };
  }

  @Post('/exit')
  exitRoom(@Body() { roomId, playerToken }: ExitRoomBody): string {
    const internalRoom = roomsRegister[roomId];

    if (!internalRoom) {
      throw new NotFoundException();
    }

    internalRoom.players = internalRoom.players.filter((player) => player.token !== playerToken);

    return 'Ok';
  }

  @Get('/player-id')
  getPlayerId(
    @Query('roomId') roomId: Room['id'],
    @Query('playerToken') playerToken: StringId,
  ): Player['id'] {
    const internalRoom = roomsRegister[roomId];

    if (!internalRoom) {
      throw new NotFoundException(`No room found with id "${roomId}"`);
    }

    const player = internalRoom.players.find((player) => player.token === playerToken);
    if (!player) {
      throw new NotFoundException(`No player found for token "${playerToken}"`);
    }

    return player.id;
  }

  @Get('/:roomId')
  getRoomById(@Param('roomId') roomId: Room['id']): Room {
    const internalRoom = roomsRegister[roomId];

    if (!internalRoom) {
      throw new NotFoundException();
    }

    return {
      game: internalRoom.game, // TODO minify?
      id: internalRoom.id,
      players: internalRoom.players.map((player) => ({ id: player.id, name: player.name })),
    };
  }

  @Post('/join')
  joinRoom(@Body() { roomId, playerName }: JoinRoomBody): RoomJoined {
    const internalRoom = roomsRegister[roomId];

    if (!internalRoom) {
      throw new NotFoundException();
    }

    const duplicateName = internalRoom.players.find((p) => p.name === playerName);
    if (duplicateName) {
      throw new BadRequestException({ code: OnlineErrorCodes.DUPLICATE_PLAYER_NAME });
    }

    const playerToken = nanoid();
    internalRoom.players.push({ id: `-1`, name: playerName, token: playerToken });

    return { playerToken, roomId: internalRoom.id };
  }

  @Post('/start')
  startGame(@Body() { roomId }: StartGameBody): string {
    const internalRoom = roomsRegister[roomId];

    if (!internalRoom) {
      throw new NotFoundException();
    }

    const playerNames = internalRoom.players.map((player) => player.name);
    const game = startGame(playerNames);

    internalRoom.game = game;
    internalRoom.players.forEach((player, index) => {
      player.id = game.players[index].id;
    });

    return 'Ok';
  }
}
