import {
  Inject,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as argon from 'argon2';
import { Services } from 'src/utils/constant';
import { IAdminService } from '../admin.interface';
import { JwtService } from '@nestjs/jwt';
import { compareHash } from 'src/utils/helper';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(Services.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
    private jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: () => void) {
    // Get the JWT token from the header
    const authHeader = req.headers.authorization;

    // Get the token from the header
    const token = authHeader.split(' ')[1];
    // Validate the token
    try {
      // Verify the token and get the decoded payload
      const decoded = await this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
      // Check if the user exists in the database
      const user = await this.adminService.findUser({ id: decoded.sub });
      const compereToken = await argon.verify(user.token, token);
      if (!user || !compereToken) {
        throw new UnauthorizedException(
          'Some One use your acount Please try to login again',
        );
      }
      // Attach the user to the request object
      req.user = user;
      next();
    } catch (err) {
      throw new UnauthorizedException(
        'You have been logged in by someone else. Please try again',
      );
    }
  }
}
