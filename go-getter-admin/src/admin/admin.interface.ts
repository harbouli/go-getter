import { CreateAdminDto } from './dto/create-admin.dto';
import { Admin } from './entities/admin.entity';
import {
  FilterQuery,
  FindUserOptions,
  FindeAdminParams,
  JwtPayload,
  PageQuery,
  PageResponse,
  Tokens,
  VerifyTokenResponse,
} from './types';

export interface IAdminService {
  createAdmin(createAdminParam: CreateAdminDto): Promise<Tokens>;
  findUser(
    findUserParams: FindeAdminParams,
    options?: FindUserOptions,
  ): Promise<Admin>;
  initApp(): Promise<boolean>;
  getTokens({ sub, username }: JwtPayload): Promise<Tokens>;
  findAllAdmins(
    pageParams: PageQuery,
    filterQuery: FilterQuery,
  ): Promise<PageResponse>;
  updateAdmin(id: number, update: Partial<Admin>);
  isValidToken(token: JwtPayload): Promise<boolean>;
  deleteAdmin(id: number): Promise<any>;
  verifyToken(jwt: { token: string }): Promise<VerifyTokenResponse>;
  logout(id: number): Promise<any>;
}
