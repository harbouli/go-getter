import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class SendPhoneNumberDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;
}
