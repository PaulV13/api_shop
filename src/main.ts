import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CORS } from './constants';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const configSwagger = new DocumentBuilder()
    .setTitle('Api shop')
    .setDescription('The shop api')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api', app, document);

  const config = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(CORS);
  const PORT = config.get('PORT');
  await app.listen(PORT);

  console.log(`App is running in port: ${PORT}`);
}
bootstrap();
