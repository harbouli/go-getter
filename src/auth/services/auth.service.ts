import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { instanceToPlain } from 'class-transformer';
import { IUserService } from 'src/users/interfaces/User.interface';
import { Services } from 'src/utils/constant';
import { Users } from 'src/utils/entities';
import { compareHash } from 'src/utils/helper';

import { IAuthService } from '../interfaces/auth.interface';
import {
  CreateCredentialsParams,
  CredentialsParams,
  JwtPayload,
  Tokens,
} from '../types';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS_SERVICE) private readonly userService: IUserService,
    private jwtService: JwtService,
  ) {}
  async validateUser(userCredentialsParams: CredentialsParams): Promise<Users> {
    const user = await this.userService.findUser(
      { email: userCredentialsParams.email },
      { selectAll: true },
    );
    if (!user)
      throw new HttpException(
        'Password Or Email Is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    const isPasswordValid = await compareHash(
      userCredentialsParams.password,
      user.password,
    );
    return isPasswordValid ? user : null;
  }

  async login(userCredentials: CredentialsParams): Promise<{ jwt: string }> {
    const isUserValid = await this.validateUser(userCredentials);
    // console.log(isUserValid);
    const payload = {
      email: isUserValid.email,
      sub: isUserValid.id,
    };

    const tokens = await this.getTokens(payload);
    await this.userService.updateRtHash(payload.sub, tokens.refresh_token);
    return { jwt: tokens.access_token };
  }

  async register(
    CreateUser: CreateCredentialsParams,
  ): Promise<{ jwt: string }> {
    const user = instanceToPlain(
      await this.userService.createUser({
        ...CreateUser,
        authType: 'emailAuth',
      }),
    );
    const payload = { email: user.email, sub: user.id };
    const tokens = await this.getTokens(payload);
    this.userService.updateRtHash(user.id, tokens.refresh_token);
    return { jwt: tokens.access_token };
  }

  logout(id: number) {
    this.userService.removeRT(id);
    return HttpStatus.OK;
  }

  async refreshTokens(userId: number, rt: string): Promise<Tokens> {
    const user = await this.userService.findUser({ id: userId });
    if (!user || !user.rfToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await compareHash(user.rfToken, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens({ sub: user.id, email: user.email });
    await this.userService.updateRtHash(user.id, tokens.refresh_token);

    return tokens;
  }

  async getTokens({ sub, email }: JwtPayload): Promise<Tokens> {
    const jwtPayload = {
      sub,
      email,
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
