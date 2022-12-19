import { CreateUserParams, Tokens } from '../types';

export interface IGoogleAuthService {
  validateUser(user: CreateUserParams): Promise<Tokens>;
}
