import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types';
import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);
type rfTokenPayload = JwtPayload & { refreshToken: string };
export const GetCurrentUser = createParamDecorator(
  (data: keyof rfTokenPayload | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;
    return user.sub;
  },
);
