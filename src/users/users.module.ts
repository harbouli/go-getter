import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/utils/constant';
import { Users } from './entities/user.entity';
import { UsersService } from './services/users.service';
import { UsersController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UsersController],
  providers: [{ provide: Services.USERS_SERVICE, useClass: UsersService }],
  exports: [{ provide: Services.USERS_SERVICE, useClass: UsersService }],
})
export class UsersModule {}
