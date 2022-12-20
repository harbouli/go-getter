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
  UseGuards,
  Query,
  UseFilters,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateAdminDto } from '../dto/create-admin.dto';
import { IAdminService } from '../admin.interface';
import { ROLES, Routes, Services } from 'src/utils/constant';
import { GetCurrentUserId, Roles } from 'src/utils/decorators';
import { RoleGuard } from 'src/utils/guards/role.guard';
import { PaginationExceptionFilter } from '../exceptions/pagination.exception';
import { UpdateAdminDto } from '../dto/update-admin.dto';
import { JWTGuard } from 'src/utils/guards/jwt.guard';

@Controller(Routes.ADMIN)
@UseGuards(JWTGuard)
@UseGuards(RoleGuard)
export class AdminController {
  constructor(
    @Inject(Services.ADMIN_SERVICE)
    private readonly adminService: IAdminService,
  ) {}

  // Create Admine
  @Post('create')
  @Roles(ROLES.SuperAdmin, ROLES.Admin)
  async create(@Body() createAdminDto: CreateAdminDto) {
    const inInti = await this.adminService.initApp();
    if (!inInti && createAdminDto.adminType === ROLES.SuperAdmin) {
      throw new HttpException(
        'Cannot Create Super Admin ',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      return this.adminService.createAdmin(createAdminDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Get All Admins

  @UseFilters(new PaginationExceptionFilter())
  @Roles(ROLES.SuperAdmin, ROLES.Admin)
  @Get()
  async findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('perPage', ParseIntPipe) perPage: number,
    @Query('role') role: ROLES[] = [],
  ) {
    const paginationQuery = { page, perPage };
    const filterQuery = { role };
    console.log(page);
    try {
      return this.adminService.findAllAdmins(paginationQuery, filterQuery);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
    @GetCurrentUserId() userId: number,
  ) {
    if (id !== userId)
      throw new HttpException('You Can Update Other User', HttpStatus.CONFLICT);
    return this.adminService.updateAdmin(+id, updateAdminDto);
  }
  @Roles(ROLES.SuperAdmin)
  @Patch('update/:id')
  updateAdminRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    try {
      return this.adminService.updateAdmin(+id, updateAdminDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Roles(ROLES.SuperAdmin, ROLES.Admin)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    try {
      return this.adminService.deleteAdmin(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
