import { IsNotEmpty, IsString } from 'class-validator';

export class SendPhoneNumberDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
