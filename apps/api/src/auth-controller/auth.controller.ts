import { Routes, Tokens } from '@app/shared';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUser, GetCurrentUserId, Public } from '@app/shared';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AuthDto } from './dto/auth.dto';
import { RtGuard } from '@app/shared/utils/guards';
import { SendPhoneNumberDto } from './dto/send-phone-number.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { PhoneAuthDto } from './dto/phone-auth.dto';
import { GoogleAuthGuard } from '@app/shared/utils/guards/google.guard';
import { Request } from 'express';

@Controller(Routes.AUTH)
export class AuthController {
  authService: any;

  //   **   Sign-Up END POINT   **  //
  @Public()
  @Post('sign-up')
  signup(@Body() createAuthDto: CreateAuthDto) {
    return;
  }

  //   **   Log-IN END POINT   **  //
  @Public()
  @Post('sig-in')
  @HttpCode(HttpStatus.OK)
  login(@Body() credentials: AuthDto) {
    return;
  }

  //   **   Logout END POINT   **  //
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return;
  }

  //   **   REFRESH TOKEN END POINT   **  //
  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @GetCurrentUserId() userId: number,
    @GetCurrentUser('refreshToken') rt: string,
  ): Promise<Tokens> {
    return;
  }

  //   **   2FA AUTH END POINT   **  //
  @Public()
  @Post('2fa')
  @HttpCode(HttpStatus.OK)
  async sendOTP(@Body() sendOTP: SendPhoneNumberDto) {
    // use the PhoneAuthService to send the OTP
    return;
  }

  //   **   Verify OTP END POINT   **  //
  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOTP(@Body() verifyOTP: VerifyOtpDto) {
    const { phoneNumber, otp } = verifyOTP;
    return;
  }
  //   **   Resend-OTP  END POINT   **  //
  @Public()
  @Post('resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendOTP(@Body() sendOTP: SendPhoneNumberDto) {
    const { phoneNumber } = sendOTP;
    return;
  }

  //   **   Register User On DB  END POINT   **  //
  @Public()
  @Post('2fa/auth')
  @HttpCode(HttpStatus.OK)
  async phoneRegister(@Body() phoneAuth: PhoneAuthDto) {
    return;
  }

  //   **   Google Auth END POINT   **  //
  @Public()
  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return;
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async handleRedirect(@Req() req: Request) {
    // console.log();
    console.log('return Tokens');
    try {
      return;
    } catch (error) {
      Logger.log(error);
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
