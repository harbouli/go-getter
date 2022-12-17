export interface IPhoneAuthService {
  isValidPhoneNumber(phoneNumber: string): Promise<boolean>;
  sendOTP(phoneNumber: string, otp: number): Promise<any>;
}
