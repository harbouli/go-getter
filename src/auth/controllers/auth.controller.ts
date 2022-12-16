import { Controller, Post, Body, UseGuards, Req, Inject } from '@nestjs/common';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { Users } from 'src/utils/entities';
import { Routes, Services } from 'src/utils/constant';
import { Request } from 'express';
import { LocalAuthGuard } from '../guards/LocalGuard';
import { IAuthService } from '../interfaces/auth.interface';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH_SERVICE) private readonly authService: IAuthService,
  ) {}

  @Post('signup')
  signup(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto as Users);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() req: Request) {
    console.log(req.user);

    return this.authService.login(req.user as Users);
  }
}
