import { NestFactory } from '@nestjs/core';
import { GameModule } from './game.module';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(GameModule);

  app.setGlobalPrefix('/api');

  await app.listen(port);
}

bootstrap();
