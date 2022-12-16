import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import entities from './utils/entities';

@Module({
  imports: [
    //  Config .env File
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
    AuthModule,
    UsersModule,
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
  providers: [],
})
export class AppModule {}
