import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { AuthController } from './auth-controller/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useFactory: (configService: ConfigService) => {
        const USER = configService.get('RABBITMQ_USER');
        const PASSWORD = configService.get('RABBITMQ_PASS');
        const AUTH_QUEUE = configService.get('RABBITMQ_AUTH_QUEUE');
        const HOST = configService.get('RABBITMQ_HOST');
        return ClientProxyFactory.create({
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
      },
    },
  ],
})
export class AppModule {}
