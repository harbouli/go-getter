import { IsEnum, IsOptional, IsString, IsEmail } from 'class-validator';
import { ROLES } from 'src/utils/constant';

export class UpdateAdminDto {
  @IsOptional()
  @IsString()
  firstName: string;
  @IsOptional()
  @IsString()
  lastName: string;
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsEnum({ Admin: 'ADMIN', Auther: 'AUTHER' })
  adminType: ROLES;
}
