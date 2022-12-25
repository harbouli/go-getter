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
  UnauthorizedException,
  BadRequestException,
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

  // LogOut
  @Get('logout')
  async lougout(@GetCurrentUserId() userId: number) {
    console.log(userId);
    try {
      const res = await this.adminService.logout(userId);
    } catch (error) {
      if (error.name === 'JsonWebTokenError') {
        throw new BadRequestException('jwt must be provided');
      }
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

    try {
      return this.adminService.findAllAdmins(paginationQuery, filterQuery);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('current-user')
  async currentUser(@GetCurrentUserId() userId: number) {
    try {
      return this.adminService.findUser({ id: userId });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  @Roles(ROLES.SuperAdmin, ROLES.Admin)
  @Get('user/:id')
  async getById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.adminService.findUser({ id });

    if (user.id !== id && user.adminType === ROLES.Auther)
      throw new UnauthorizedException('Unauthorize');
    try {
      return user;
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
  async updateAdminRole(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    console.log(id);
    try {
      return await this.adminService.updateAdmin(+id, updateAdminDto);
    } catch (error) {
      if (error.name == 'UpdateValuesMissingError')
        throw new HttpException(
          'You Should To Put Values',
          HttpStatus.BAD_REQUEST,
        );
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
