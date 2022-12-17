import { Users } from 'src/utils/entities';
import {
  CreateCredentialsParams,
  CredentialsParams,
  JwtPayload,
  Tokens,
} from '../types';

export interface IAuthService {
  validateUser(userCredentialsParams: CredentialsParams): Promise<Users | null>;
  login(user: CredentialsParams): Promise<{ jwt: string }>;
  register(CreateUser: CreateCredentialsParams): Promise<{ jwt: string }>;
  getTokens({ sub, email }: JwtPayload): Promise<Tokens>;
}
