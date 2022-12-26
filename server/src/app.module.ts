import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import entities from './utils/entities';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './utils/guards/at.guard';
import { redisModule } from './utils/moduls.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICES } from '../../shared/microservices';

@Module({
  imports: [
    //  Config .env File
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    ClientsModule.register([
      {
        name: MICROSERVICES.DASHBOARD_SERVEVER,
        transport: Transport.TCP,
        options: { port: 3030 },
      },
    ]),
    AuthModule,
    UsersModule,
    redisModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_DATABASE_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      synchronize: true,
      entities,
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
