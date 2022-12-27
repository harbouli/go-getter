import { CreateUserParams, Tokens } from '../types/authTypes';

export interface IGoogleAuthService {
  validateUser(user: CreateUserParams): Promise<Tokens>;
}
