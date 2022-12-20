import { CreateAdminDto } from './dto/create-admin.dto';
import { JwtPayload, Tokens } from './types';

export interface IAdminService {
  createAdmin(createAdminParam: CreateAdminDto): Promise<Tokens>;
  initApp(): Promise<boolean>;
  getTokens({ sub, username }: JwtPayload): Promise<Tokens>;
}
