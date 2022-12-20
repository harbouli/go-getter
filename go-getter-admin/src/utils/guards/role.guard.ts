import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JWTGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    const isRole = this.reflector.getAllAndOverride('roles', [
      context.getClass(),
      context.getHandler(),
      context.getArgs,
    ]);
    if (isPublic) return true;
    console.log(isRole);

    return super.canActivate(context);
  }
}
