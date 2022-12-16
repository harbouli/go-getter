import { Users } from '../entities/user.entity';
import { CreateUserParameters } from '../types/userType';

export interface IUserService {
  createUser(userDetails: CreateUserParameters): Promise<Users>;
  //   findUser(
  //     findUserParams: FindUserParameters,
  //     options?: FindUserOptions,
  //   ): Promise<User>;
  //   saveUser(user: User): Promise<User>;
  //   searchUsers(query: string): Promise<User[]>;
}
