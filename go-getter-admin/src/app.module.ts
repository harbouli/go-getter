import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminModule } from './admin/admin.module';
import entities from './utils/entities';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JWTGuard } from './utils/guards/role.guard';
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env.development' }),
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
    AdminModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JWTGuard,
    },
  ],
})
export class AppModule {}
