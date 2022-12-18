import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { IPhoneAuthService } from '../interfaces/phone-auth.interface';
import Redis from 'ioredis';
import { IORedisKey } from 'src/redis/redis.module';
import { instanceToPlain } from 'class-transformer';
import { PhoneAuthParam, Tokens } from '../types';
import { Services } from 'src/utils/constant';
import { IUserService } from 'src/users/interfaces/User.interface';
import { IAuthService } from '../interfaces/auth.interface';

@Injectable()
export class PhoneAuthService implements IPhoneAuthService {
  private readonly client: Twilio;
  constructor(
    @Inject(Services.USERS_SERVICE) private readonly userService: IUserService,
    @Inject(Services.AUTH_SERVICE) private readonly authService: IAuthService,
    @Inject(IORedisKey) private readonly redis: Redis,
  ) {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async isValidPhoneNumber(phoneNumber: string): Promise<boolean> {
    try {
      const response = await this.client.lookups
        .phoneNumbers(phoneNumber)
        .fetch();
      return response.phoneNumber !== null;
    } catch (error) {
      return false;
    }
  }
  async sendOTP(phoneNumber: string, otp: number): Promise<any> {
    const isValid = await this.isValidPhoneNumber(phoneNumber);
    if (!isValid)
      throw new HttpException(
        'This phone number is not valid',
        HttpStatus.BAD_REQUEST,
      );
    try {
      const sendOTP = await this.client.messages.create({
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Your OTP is: ${otp}`,
      });
      // save the OTP in Redis for 60 seconds
      await this.redis.setex(phoneNumber, 60, otp);
      return sendOTP;
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error) });
    }
  }

  async verifyOTP(phoneNumber: string, enteredOTP: string): Promise<any> {
    //  retrieve the OTP from Redis
    const otp = await this.redis.get(phoneNumber);

    if (otp === null) {
      throw new HttpException('Invalid OTP Code.', HttpStatus.BAD_REQUEST);
    } else {
      if (otp === enteredOTP) {
        await this.redis.setex(phoneNumber, 60 * 60, 'verify');
        const userExist = await this.userService.findUser({ phoneNumber });
        if (userExist) {
          return this.authService.login({ phoneNumber });
        }
        return { success: true, message: 'OTP is valid.' };
      } else {
        throw new HttpException('Invalid OTP Code.', HttpStatus.BAD_REQUEST);
      }
    }
  }

  async resendOTP(phoneNumber: string) {
    // ** generate a random OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    // ** send the OTP via Twilio
    try {
      const sendOTP = await this.client.messages.create({
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Your OTP is: ${otp}`,
      });
      // save the OTP in Redis for 60 seconds
      await this.redis.setex(phoneNumber, 60, otp);
      return sendOTP;
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error) });
    }
  }
  async registerWithPhone(createUser: PhoneAuthParam): Promise<Tokens> {
    const isVerified = await this.redis.get(createUser.phoneNumber);
    if (!isVerified)
      throw new HttpException(
        'Phone Number Is Not Verified',
        HttpStatus.UNAUTHORIZED,
      );
    const user = instanceToPlain(
      await this.userService.createUser({
        ...createUser,
        authType: 'phoneAuth',
      }),
    );
    const payload = { username: user.phoneNumber, sub: user.id };
    const tokens = await this.authService.getTokens(payload);
    this.userService.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }
}
