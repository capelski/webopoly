import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Game, Id } from '../../core';

const games: { [id: Id]: Game } = {};

@Controller()
export class GameController {
  constructor() {}

  @Get('/:id')
  getGameById(@Param() id: Id) {
    const game = games[id];

    if (!game) {
      throw new NotFoundException();
    }

    return game;
  }
}
