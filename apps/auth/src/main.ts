import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  const USER = configService.get('RABBITMQ_USER');
  const PASSWORD = configService.get('RABBITMQ_PASS');
  const AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
  const HOST = configService.get('RABBITMQ_HOST');
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${HOST}:${USER}@${PASSWORD}`],
      noAck: false,
      queue: AUTH_QUEUE,
      queueOptions: {
        durabale: true,
      },
    },
  });
}
bootstrap();
