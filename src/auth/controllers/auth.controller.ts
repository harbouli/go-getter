import {
  Controller,
  Post,
  Body,
  Inject,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { Users } from 'src/utils/entities';
import { Routes, Services } from 'src/utils/constant';

import { IAuthService } from '../interfaces/auth.interface';
import { CredentialsParams } from '../types';
import { AuthDto } from '../dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Public } from 'src/utils/decorators';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH_SERVICE) private readonly authService: IAuthService,
  ) {}
  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto as Users);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() credentials: AuthDto) {
    return this.authService.login(credentials as CredentialsParams);
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Req() req: Request) {
    const user = req.user;
    console.log(user);
  }
}
