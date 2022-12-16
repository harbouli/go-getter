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
  //   saveUser(user: User): Promise<User>;
}
