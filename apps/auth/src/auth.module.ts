import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PhoneAuthService } from './services/phone-auth.service';
import { Services } from '@app/shared';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from './strategies/at.strategy';
// import { UsersModule } from '@app/shared';
import { redisModule } from '@app/shared';
import { RtStrategy } from './strategies/rt.strategy';
import { GoogleStrategy } from './strategies/google-strategy';
import { googleAuthService } from './services/google-auth.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
    }),
    redisModule,
    // UsersModule,
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
