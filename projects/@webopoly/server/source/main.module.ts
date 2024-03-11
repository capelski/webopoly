import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GamesController } from './games.controller';
import { RoomsController } from './rooms.controller';
import { SystemController } from './system.controller';

/** Relative to the transpiled file (i.e. server/dist/server/source/app.module.js) */
const assetsPath = join(__dirname, '..', '..', '..', 'public');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      renderPath: '/',
      rootPath: assetsPath,
    }),
  ],
  controllers: [GamesController, RoomsController, SystemController],
})
export class MainModule {}
