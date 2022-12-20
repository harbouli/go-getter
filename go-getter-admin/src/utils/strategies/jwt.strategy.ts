import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/admin/types';
import { Services } from '../constant';
import { IAdminService } from 'src/admin/admin.interface';
import { UnauthorizedException } from '@nestjs/common/exceptions';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(Services.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    console.log(payload);
    return payload;
  }
}
