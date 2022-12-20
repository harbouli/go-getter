import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { Routes, Services } from 'src/utils/constant';
import { Public } from 'src/utils/decorators';
import { IsPiblicGuard } from 'src/utils/guards/isPublic.guard';
import { LoginDto } from '../dto/login.dto';
import { AdminService } from '../admin.service';

@Controller(Routes.AUTH)
@UseGuards(IsPiblicGuard)
export class AuthAdminController {
  constructor(
    @Inject(Services.ADMIN_SERVICE) private readonly adminService: AdminService,
  ) {}
  @Post('login')
  @Public()
  async create(@Body() loginParams: LoginDto) {
    console.log('first');
    return;
  }
}
