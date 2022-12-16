import { Injectable } from '@nestjs/common';
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
}
