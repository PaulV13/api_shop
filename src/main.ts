import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CORS } from './constants';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(CORS);
  const PORT = config.get('PORT');
  await app.listen(PORT);

  console.log(`App is running in port: ${PORT}`);
}
bootstrap();
