import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Room } from '../../core';
import { roomsRegister } from './rooms.controller';

@Controller('/games')
export class GamesController {
  @Get('/:roomId')
  getGameById(@Param('roomId') roomId: Room['id']) {
    const room = roomsRegister[roomId];

    if (!room) {
      throw new NotFoundException();
    }

    return room.game;
  }
}
