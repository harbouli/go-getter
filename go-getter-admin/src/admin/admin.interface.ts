import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './entities/admin.entity';
import {
  FilterQuery,
  JwtPayload,
  PageQuery,
  PageResponse,
  Tokens,
} from './types';

export interface IAdminService {
  createAdmin(createAdminParam: CreateAdminDto): Promise<Tokens>;
  initApp(): Promise<boolean>;
  getTokens({ sub, username }: JwtPayload): Promise<Tokens>;
  findAllAdmins(
    pageParams: PageQuery,
    filterQuery: FilterQuery,
  ): Promise<PageResponse>;
  updateAdmin(id: number, update: Partial<Admin>);
  isValidToken(token: JwtPayload): Promise<boolean>;
  deleteAdmin(id: number): Promise<any>;
}
