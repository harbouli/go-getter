import { Users } from '../entities/user.entity';
import {
  CreateUserParameters,
  FindUserOptions,
  FindUserParameters,
} from '../types/userType';

export interface IUserService {
  createUser(userDetails: CreateUserParameters): Promise<Users>;
  findUser(
    findUserParams: FindUserParameters,
    options?: FindUserOptions,
  ): Promise<Users>;
  updateRtHash(id: number, rt: string): Promise<void>;
  removeRT(id: number): void;
  //   saveUser(user: User): Promise<User>;
}
