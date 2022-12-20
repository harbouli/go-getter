import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { IAdminService } from './admin.interface';
import { Admins, Routes, Services } from 'src/utils/constant';
import { Public, Roles } from 'src/utils/decorators';

@Controller(Routes.ADMIN)
export class AdminController {
  constructor(
    @Inject(Services.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}
  @Public()
  @Post('create')
  async create(@Body() createAdminDto: CreateAdminDto) {
    const inInti = await this.adminService.initApp();
    if (!inInti && createAdminDto.adminType === Admins.SuperAdmin) {
      throw new HttpException(
        'Cannot Create Super Admin ',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return this.adminService.createAdmin(createAdminDto);
  }
  @Roles('SUPER_ADMIN')
  @Get()
  findAll() {
    return { msg: 'you r a use' };
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.adminService.update(+id, updateAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.adminService.remove(+id);
  // }
}
