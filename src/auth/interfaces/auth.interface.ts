import { Users } from 'src/utils/entities';
import {
  CreateCredentialsParams,
  CredentialsParams,
  JwtPayload,
  Tokens,
  rfTokenParam,
} from '../types';

export interface IAuthService {
  validateUser(userCredentialsParams: CredentialsParams): Promise<Users | null>;
  login(user: CredentialsParams): Promise<{ jwt: string }>;
  register(CreateUser: CreateCredentialsParams): Promise<{ jwt: string }>;
  getTokens({ sub, username }: JwtPayload): Promise<Tokens>;
  logout(id: number);
  refreshTokens(rgToken: rfTokenParam): Promise<{ jwt: string }>;
}
