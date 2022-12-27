import { User } from '@app/shared/types/userTypes';
import {
  CreateUserParams,
  CredentialsParams,
  JwtPayload,
  Tokens,
  rfTokenParam,
} from '../types/authTypes';

export interface IAuthService {
  validateUser(userCredentialsParams: CredentialsParams): Promise<User | null>;
  login(user: CredentialsParams): Promise<Tokens>;
  register(CreateUser: CreateUserParams): Promise<Tokens>;
  getTokens({ sub, username }: JwtPayload): Promise<Tokens>;
  logout(id: number);
  refreshTokens(rgToken: rfTokenParam): Promise<Tokens>;
}
