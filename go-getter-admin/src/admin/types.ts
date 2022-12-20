import { ROLES } from 'src/utils/constant';
import { Admin } from './entities/admin.entity';

export type FindeAdminParams = Partial<{
  email?: string;
  id?: number;
  phoneNumber?: string;
}>;
export type FindUserOptions = Partial<{
  selectAll: boolean;
}>;
export type Tokens = { access_token: string };

export type JwtPayload = {
  username: string;
  sub: number;
  role: string;
};

export type PageQuery = { page: number; perPage: number };

export type PageResponse = { admins: Admin[]; total: number; pages: number };
export type FilterQuery = { role: ROLES[] };
export type AdminLoginParam = { email: string; password: string };
