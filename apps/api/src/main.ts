import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');

  app.enableCors({ origin: ['http://localhost:3000'], credentials: true });
  await app.listen(PORT, () => Logger.log('App running in port ' + PORT));
}
bootstrap();
