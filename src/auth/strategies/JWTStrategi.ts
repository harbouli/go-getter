import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserService } from 'src/users/interfaces/User.interface';
import { Services } from 'src/utils/constant';
import { Users } from 'src/utils/entities';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.USERS_SERVICE) private readonly userService: IUserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(validationPayload: {
    email: string;
    sub: number;
  }): Promise<Users | null> {
    return await this.userService.findUser({
      email: validationPayload.email,
    });
  }
}
