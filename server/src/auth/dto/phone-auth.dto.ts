import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class PhoneAuthDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
