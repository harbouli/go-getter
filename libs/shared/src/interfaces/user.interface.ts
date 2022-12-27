import {
  CreateUserParameters,
  FindUserOptions,
  FindUserParameters,
  User,
} from '../types/userTypes';

export interface IUserService {
  createUser(userDetails: CreateUserParameters): Promise<User>;
  findUser(
    findUserParams: FindUserParameters,
    options?: FindUserOptions,
  ): Promise<User>;
  updateRtHash(id: number, rt: string): Promise<void>;
  removeRT(id: number): void;
  //   saveUser(user: User): Promise<User>;
}
