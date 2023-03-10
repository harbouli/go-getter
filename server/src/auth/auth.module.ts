import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PhoneAuthService } from './services/phone-auth.service';
import { Services } from 'src/utils/constant';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './strategies/at.strategy';
import { UsersModule } from 'src/users/users.module';
import { RtStrategy } from './strategies/rt.strategy';
import { redisModule } from 'src/utils/moduls.config';
import { GoogleStrategy } from './strategies/google-strategy';
import { googleAuthService } from './services/google-auth.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    redisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AtStrategy,
    RtStrategy,
    GoogleStrategy,
    {
      provide: Services.AUTH_SERVICE,
      useClass: AuthService,
    },
    {
      provide: Services.AUTH_PHONE_SERVICE,
      useClass: PhoneAuthService,
    },
    {
      provide: Services.AUTH_GOOGLE_SERVICE,
      useClass: googleAuthService,
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
