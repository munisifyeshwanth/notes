import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api/');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['2', '1'],
  });
  await app.listen(process.env.PORT);
}
bootstrap();
