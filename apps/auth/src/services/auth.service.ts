import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { IUserService } from '@app/shared/interfaces/user.interface';
import { Services } from '@app/shared/utils/constant';
import { User } from '@app/shared';
import { compareHash } from '@app/shared';

import { IAuthService } from '../../../../libs/shared/src/interfaces/auth.interface';
import {
  CreateUserParams,
  CredentialsParams,
  JwtPayload,
  Tokens,
  rfTokenParam,
} from '../types';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS_SERVICE) private readonly userService: IUserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(userCredentialsParams: CredentialsParams): Promise<User> {
    const user = await this.userService.findUser(
      { email: userCredentialsParams.email },
      { selectAll: true },
    );
    if (!user)
      throw new HttpException(
        'Password or email is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    const isPasswordValid = await compareHash(
      userCredentialsParams.password,
      user.password,
    );
    return isPasswordValid ? user : null;
  }

  async login(userCredentials: CredentialsParams): Promise<Tokens> {
    const isUserValid = await this.validateUser(userCredentials);
    const payload = {
      username: isUserValid.email,
      sub: isUserValid.id,
    };

    const tokens = await this.getTokens(payload);
    await this.userService.updateRtHash(payload.sub, tokens.refresh_token);
    return tokens;
  }

  async register(CreateUser: CreateUserParams): Promise<Tokens> {
    const user = instanceToPlain(
      await this.userService.createUser({
        ...CreateUser,
        authType: 'emailAuth',
      }),
    );
    const payload = { username: user.email, sub: user.id };
    const tokens = await this.getTokens(payload);
    this.userService.updateRtHash(user.id, tokens.refresh_token);
    return tokens;
  }

  logout(id: number) {
    return this.userService.removeRT(id);
  }

  async refreshTokens({ userId, rt }: rfTokenParam): Promise<Tokens> {
    const user = await this.userService.findUser({ id: userId });
    if (!user || !user.rfToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await compareHash(rt, user.rfToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens({ sub: user.id, username: user.email });
    await this.userService.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async getTokens({ sub, username }: JwtPayload): Promise<Tokens> {
    const jwtPayload = {
      sub,
      username,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '30d',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET_REFRESH,
        expiresIn: '45d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }
}
