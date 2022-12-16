import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/user.entity';
import { IUserService } from '../interfaces/User.interface';
import { CreateUserParameters } from '../types/userType';
import { Twilio } from 'twilio';

@Injectable()
export class UsersService implements IUserService {
  constructor(
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}
  async createUser(userDetails: CreateUserParameters): Promise<Users> {
    if (userDetails.authType === 'phoneAuth') {
    }
    const newUser = this.userRepository.create(userDetails);
    return;
  }
}
