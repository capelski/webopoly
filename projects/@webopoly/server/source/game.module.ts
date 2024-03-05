import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameController } from './game.controller';

/** Relative to the transpiled file (i.e. server/dist/server/source/app.module.js) */
const assetsPath = join(__dirname, '..', '..', '..', 'public');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      renderPath: '/',
      rootPath: assetsPath,
    }),
  ],
  controllers: [GameController],
})
export class GameModule {}
