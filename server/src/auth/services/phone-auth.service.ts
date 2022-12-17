import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Twilio } from 'twilio';
import { IPhoneAuthService } from '../interfaces/phone-auth.interface';

@Injectable()
export class PhoneAuthService implements IPhoneAuthService {
  private readonly client: Twilio;
  constructor() {
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
      await this.client.messages.create({
        to: phoneNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: `Your OTP is: ${otp}`,
      });
    } catch (error) {
      throw new HttpException(error, 400, { cause: new Error(error) });
    }
  }
}
