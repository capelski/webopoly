import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RoomsGateway } from './rooms.gateway';
import { SystemController } from './system.controller';

const assetsPath = join(__dirname, '..', 'public');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      renderPath: '/',
      rootPath: assetsPath,
    }),
  ],
  controllers: [SystemController],
  providers: [RoomsGateway],
})
export class MainModule {}
