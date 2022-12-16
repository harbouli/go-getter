import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { PhoneAuthService } from './services/phone-auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PhoneAuthService],
})
export class AuthModule {}
