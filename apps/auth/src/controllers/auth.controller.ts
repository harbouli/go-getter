import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from '../../../api/src/auth-controller/dto/create-auth.dto';
import { User } from '@app/shared';
import { Routes, Services } from '@app/shared';

import { IAuthService } from '@app/shared';
import { CredentialsParams, Tokens } from '../types';
import { AuthDto } from '../../../api/src/auth-controller/dto/auth.dto';

import { GetCurrentUser, GetCurrentUserId, Public } from '@app/shared';
import { RtGuard } from '@app/shared/utils/guards/rt.guard';
import { IPhoneAuthService } from '@app/shared';
import { otp } from '@app/shared';
import { SendPhoneNumberDto } from '../../../api/src/auth-controller/dto/send-phone-number.dto';
import { VerifyOtpDto } from '../../../api/src/auth-controller/dto/verify-otp.dto';
import { PhoneAuthDto } from '../../../api/src/auth-controller/dto/phone-auth.dto';
import { GoogleAuthGuard } from '@app/shared/utils/guards/google.guard';
import { IGoogleAuthService } from '@app/shared';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH_GOOGLE_SERVICE)
    private readonly googleAuthService: IGoogleAuthService,
    @Inject(Services.AUTH_SERVICE) private readonly authService: IAuthService,
    @Inject(Services.AUTH_PHONE_SERVICE)
    private readonly phoneAuthService: IPhoneAuthService,
  ) {}

  // Local Auth Routs
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto as User);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() credentials: AuthDto) {
    return this.authService.login(credentials as CredentialsParams);
  }

  // Auth Handlers
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

  // 2AF Routes
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
  @Post('2fa/auth')
  @HttpCode(HttpStatus.OK)
  async phoneRegister(@Body() phoneAuth: PhoneAuthDto) {
    return this.phoneAuthService.registerWithPhone(phoneAuth);
  }

  // Google Auth Routes

  @Public()
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return { msg: 'Google Authentication' };
  }
  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req) {
    // console.log();
    console.log('return Tokens');
    try {
      return this.googleAuthService.validateUser({
        lastName: req.user.name.familyName,
        firstName: req.user.name.givenName,
        email: req.user.emails[0].value,
      });
    } catch (error) {
      Logger.log(error);
      throw new UnauthorizedException();
    }
  }
}
