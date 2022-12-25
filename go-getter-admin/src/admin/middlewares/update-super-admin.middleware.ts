import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ROLES } from 'src/utils/constant';

import { Admin } from '../entities/admin.entity';

@Injectable()
export class UpdateSuperAdminMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: () => void) {
    // Get the JWT token from the header
    const authHeader = req.headers.authorization;
    const user = req.user as Admin;
    const userParam = req.params.id;
    if (
      user.id === +userParam &&
      (req.body.adminType === ROLES.Auther ||
        req.body.adminType === ROLES.Admin)
    )
      throw new BadRequestException("You can't Update Your Role");

    next();
  }
  catch(err) {
    throw new UnauthorizedException(
      'You have been logged in by someone else. Please try again',
    );
  }
}
