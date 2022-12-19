import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from 'src/utils/helper';

import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import { IUserService } from '../interfaces/User.interface';
import {
  CreateUserParameters,
  FindUserOptions,
  FindUserParameters,
} from '../types/userType';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  //   Create User
  async createUser(userDetails: CreateUserParameters): Promise<Users> {
    let params: CreateUserParameters;
    if (
      userDetails.authType === 'phoneAuth' ||
      userDetails.authType === 'googleAuth'
    ) {
      params = {
        ...userDetails,
        password: '',
      };
    } else {
      const existingUser = await this.userRepository.findOne({
        where: { email: userDetails.email },
      });
      if (existingUser)
        throw new HttpException('User Is Already Exists', HttpStatus.CONFLICT);
      const password = await hashPassword(userDetails.password);
      params = {
        ...userDetails,
        password,
      };
    }
    const newUser = this.userRepository.create(params);
    return this.userRepository.save(newUser);
  }

  //   Find User
  findUser(
    findUserParams: FindUserParameters,
    options?: FindUserOptions,
  ): Promise<Users> {
    const selections: (keyof Users)[] = [
      'id',
      'authType',
      'firstName',
      'lastName',
      'authType',
      'phoneNumber',
      'email',
      'rfToken',
    ];
    const selectionsWithPassword: (keyof Users)[] = [...selections, 'password'];
    return this.userRepository.findOne({
      where: { ...findUserParams },
      select: options?.selectAll ? selectionsWithPassword : selections,
    });
  }
  // UpdateRTHash
  async updateRtHash(id: number, rt: string): Promise<void> {
    const hashRt = await hashPassword(rt);
    await this.userRepository.update(id, { rfToken: hashRt });
  }

  // Remove Hashed Token
  async removeRT(id: number): Promise<any> {
    const user = await this.findUser({ id });
    console.log(user);
    if (!user || !user.rfToken)
      throw new HttpException(
        'This User does not exist or logout',
        HttpStatus.BAD_REQUEST,
      );

    await this.userRepository
      .createQueryBuilder()
      .update()
      .set({ rfToken: null })
      .where('id = :id', { id })
      .andWhere('refresh_token IS NOT NULL')
      .execute();
    return HttpStatus.OK;
  }
}
