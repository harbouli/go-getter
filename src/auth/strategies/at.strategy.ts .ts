import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { JwtPayload } from '../types';

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    console.log('object');
  }

  async validate(validationPayload: JwtPayload) {
    return validationPayload;
  }
}
