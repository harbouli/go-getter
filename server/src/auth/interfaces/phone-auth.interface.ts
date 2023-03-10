import { PhoneAuthParam, Tokens } from '../types';

export interface IPhoneAuthService {
  isValidPhoneNumber(phoneNumber: string): Promise<boolean>;
  sendOTP(phoneNumber: string, otp: number): Promise<any>;
  verifyOTP(phoneNumber: string, enteredOTP: string): Promise<any>;
  resendOTP(phoneNumber: string): Promise<any>;
  registerWithPhone(createUser: PhoneAuthParam): Promise<Tokens>;
}
