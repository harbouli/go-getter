import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './controllers/admin.controller';
import { Services } from 'src/utils/constant';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JWRStrategy } from 'src/utils/strategies/jwt.strategy';
import { AuthAdminController } from './controllers/auth-admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AdminController, AuthAdminController],
  providers: [
    { provide: Services.ADMIN_SERVICE, useClass: AdminService },
    JWRStrategy,
  ],
})
export class AdminModule {}
