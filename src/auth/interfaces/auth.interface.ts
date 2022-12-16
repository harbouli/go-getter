import { Users } from 'src/utils/entities';
import { CreateCredentialsParams, CredentialsParams } from '../types';

export interface IAuthService {
  validateUser(userCredentialsParams: CredentialsParams): Promise<Users | null>;
  login(user: Users): { jwt: string; user: any };
  verify(token: string): Promise<Users>;
  register(
    CreateUser: CreateCredentialsParams,
  ): Promise<{ user: any; jwt: string }>;
}
