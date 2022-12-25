import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Routes, Services } from 'src/utils/constant';
import { LoginDto } from '../dto/login.dto';
import { AdminService } from '../admin.service';
import { Request, Response } from 'express';

@Controller(Routes.AUTH)
export class AuthAdminController {
  constructor(
    @Inject(Services.ADMIN_SERVICE) private readonly adminService: AdminService,
  ) {}
  @Post('login')
  async create(@Body() loginParams: LoginDto, @Res() res: Response) {
    // res.setHeader()
    const user = await this.adminService.loginAdmin(loginParams);
    res.setHeader('Authorization', `Bearer ${user.access_token}`);
    res.send(user);
  }
  // Verify Token
  @Get('verifyToken')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Req() req: Request, @Res() res: Response) {
    // res.setHeader()
    res.setHeader('Access-Control-Expose-Headers', 'Authorization');
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const user = await this.adminService.verifyToken({ token });
        res.setHeader('Authorization', `Bearer ${token}`);
        res.send(user);
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          throw new BadRequestException('jwt must be provided');
        }
      }
    }
  }
}
