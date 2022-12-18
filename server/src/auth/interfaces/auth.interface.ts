import { Users } from 'src/utils/entities';
import {
  CreateUserParams,
  CredentialsParams,
  JwtPayload,
  Tokens,
  rfTokenParam,
} from '../types';

export interface IAuthService {
  validateUser(userCredentialsParams: CredentialsParams): Promise<Users | null>;
  login(user: CredentialsParams): Promise<Tokens>;
  register(CreateUser: CreateUserParams): Promise<Tokens>;
  getTokens({ sub, username }: JwtPayload): Promise<Tokens>;
  logout(id: number);
  refreshTokens(rgToken: rfTokenParam): Promise<Tokens>;
}
