import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PhoneAuthService } from './services/phone-auth.service';
import { Services } from 'src/utils/constant';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/LocalStrategy';
import { JWTStrategy } from './strategies/JWTStrategi';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    LocalStrategy,
    JWTStrategy,
    {
      provide: Services.AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: Services.AUTH_PHONE_SERVICE,
      useClass: PhoneAuthService,
    },
  ],
  exports: [
    {
      provide: Services.AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: Services.AUTH_PHONE_SERVICE,
      useClass: PhoneAuthService,
    },
  ],
})
export class AuthModule {}
