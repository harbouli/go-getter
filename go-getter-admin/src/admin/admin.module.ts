import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './controllers/admin.controller';
import { Services } from 'src/utils/constant';
import { Admin } from './entities/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { JWTStrategy } from 'src/utils/strategies/jwt.strategy';
import { AuthAdminController } from './controllers/auth-admin.controller';
import { AuthMiddleware } from './middlewares/validate-toke.middleware';

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
    JWTStrategy,
  ],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AdminController);
  }
}
