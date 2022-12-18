import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { Users } from 'src/utils/entities';
import { Routes, Services } from 'src/utils/constant';

import { IAuthService } from '../interfaces/auth.interface';
import { CredentialsParams, Tokens } from '../types';
import { AuthDto } from '../dto/auth.dto';

import { GetCurrentUser, GetCurrentUserId, Public } from 'src/utils/decorators';
import { RtGuard } from 'src/utils/guards';
import { IPhoneAuthService } from '../interfaces/phone-auth.interface';
import { otp } from 'src/utils/helper';
import { SendPhoneNumberDto } from '../dto/send-phone-number.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH_SERVICE) private readonly authService: IAuthService,
    @Inject(Services.AUTH_PHONE_SERVICE)
    private readonly phoneAuthService: IPhoneAuthService,
  ) {}
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto as Users);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() credentials: AuthDto) {
    return this.authService.login(credentials as CredentialsParams);
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') rt: string,
  ): Promise<Tokens> {
    return await this.authService.refreshTokens({ userId, rt });
  }

  @Public()
  @Post('2fa')
  @HttpCode(HttpStatus.OK)
  async sendOTP(@Body() sendOTP: SendPhoneNumberDto) {
    // use the PhoneAuthService to send the OTP
    return this.phoneAuthService.sendOTP(sendOTP.phoneNumber, otp());
  }
  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOTP(@Body() verifyOTP: VerifyOtpDto) {
    const { phoneNumber, otp } = verifyOTP;
    return this.phoneAuthService.verifyOTP(phoneNumber, otp);
  }
  @Public()
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOTP(@Body() sendOTP: SendPhoneNumberDto) {
    const { phoneNumber } = sendOTP;
    return this.phoneAuthService.resendOTP(phoneNumber);
  }
  @Public()
  @Post('2fa/register')
  @HttpCode(HttpStatus.OK)
  async phoneRegister(@Body() phoneAuth: CreateAuthDto) {
    return this.phoneAuthService.registerWithPhone(phoneAuth as Users);
  }
}
