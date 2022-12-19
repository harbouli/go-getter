import { Inject, Injectable } from '@nestjs/common';
import { IGoogleAuthService } from '../interfaces/google-auth.interface';
import { CreateUserParams, Tokens } from '../types';
import { Services } from 'src/utils/constant';
import { IUserService } from 'src/users/interfaces/User.interface';
import { IAuthService } from '../interfaces/auth.interface';

@Injectable()
export class googleAuthService implements IGoogleAuthService {
  constructor(
    @Inject(Services.USERS_SERVICE) private readonly usersService: IUserService,
    @Inject(Services.AUTH_SERVICE) private readonly authService: IAuthService,
  ) {}
  async validateUser(user: CreateUserParams): Promise<Tokens> {
    const userExist = await this.usersService.findUser({ email: user.email });
    if (userExist) {
      const tokens = await this.authService.getTokens({
        sub: userExist.id,
        username: userExist.email,
      });
      await this.usersService.updateRtHash(userExist.id, tokens.refresh_token);
      return tokens;
    }
    console.log('Creating New User...');
    const newUser = await this.usersService.createUser({
      ...user,
      authType: 'googleAuth',
    });
    const tokens = await this.authService.getTokens({
      sub: newUser.id,
      username: newUser.email,
    });
    await this.usersService.updateRtHash(newUser.id, tokens.refresh_token);

    return tokens;
  }
}
