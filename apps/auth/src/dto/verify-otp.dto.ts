import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(5)
  @MinLength(3)
  otp: string;
}
