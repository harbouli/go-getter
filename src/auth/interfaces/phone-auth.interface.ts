export interface IPhoneAuthService {
  isValidPhoneNumber(phoneNumber: string): Promise<boolean>;
}
