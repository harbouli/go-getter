import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { IUserService } from 'src/users/interfaces/User.interface';
import { Services } from 'src/utils/constant';
import { Users } from 'src/utils/entities';
import { compareHash } from 'src/utils/helper';

import { IAuthService } from '../interfaces/auth.interface';
import { CreateCredentialsParams, CredentialsParams } from '../types';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS_SERVICE) private readonly userService: IUserService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUser(userCredentialsParams: CredentialsParams): Promise<Users> {
    const user = await this.userService.findUser(
      { email: userCredentialsParams.email },
      { selectAll: true },
    );
    if (!user)
      throw new HttpException(
        'Password Or Username Is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    const isPasswordValid = await compareHash(
      userCredentialsParams.password,
      user.password,
    );
    return isPasswordValid ? user : null;
  }
  login(userCredentials: Users): { jwt: string; user: any } {
    const payload = {
      email: userCredentials.email,
      sub: userCredentials.id,
    };

    const jwt = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    const user = instanceToPlain(userCredentials);
    return { jwt, user };
  }
  async verify(token: string): Promise<Users> {
    const decoded = this.jwtService.verify(token, {
      secret: process.env.JWT_SECRET,
    });
    const user = await this.userService.findUser({
      email: decoded.username,
    });
    return user;
  }
  async register(
    CreateUser: CreateCredentialsParams,
  ): Promise<{ user: any; jwt: string }> {
    const user = instanceToPlain(
      await this.userService.createUser({
        ...CreateUser,
        authType: 'emailAuth',
      }),
    );
    const payload = { username: user.username, sub: user.id };
    const jwt = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
    });
    return { jwt, user };
  }
}
