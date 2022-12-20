import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constant';
import { LoginDto } from '../dto/login.dto';
import { AdminService } from '../admin.service';

@Controller(Routes.AUTH)
export class AuthAdminController {
  constructor(
    @Inject(Services.ADMIN_SERVICE) private readonly adminService: AdminService,
  ) {}
  @Post('login')
  async create(@Body() loginParams: LoginDto) {
    console.log(loginParams);
    return this.adminService.loginAdmin(loginParams);
  }
}
