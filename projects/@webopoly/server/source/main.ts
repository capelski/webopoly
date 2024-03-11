import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';

const port = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(MainModule);

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);
}

bootstrap();
