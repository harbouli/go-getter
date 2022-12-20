import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { IAdminService } from './admin.interface';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  AdminLoginParam,
  FilterQuery,
  FindUserOptions,
  FindeAdminParams,
  JwtPayload,
  PageQuery,
  PageResponse,
  Tokens,
} from './types';
import * as argon from 'argon2';
import { compareHash, hashPassword } from 'src/utils/helper';
import { JwtService } from '@nestjs/jwt';
import { ROLES } from 'src/utils/constant';

@Injectable()
export class AdminService implements IAdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async createAdmin(createAdminParam: CreateAdminDto): Promise<Tokens> {
    const existingUser = await this.adminRepository.findOne({
      where: { email: createAdminParam.email },
    });
    if (existingUser)
      throw new HttpException('User Is Already Exists', HttpStatus.CONFLICT);
    const hashedPassword = await hashPassword(createAdminParam.password);
    const newAdmin = this.adminRepository.create({
      ...createAdminParam,
      password: hashedPassword,
    });
    Logger.log('Creating Admin ...');
    const admin = await this.adminRepository.save(newAdmin);
    const token = await this.getTokens({
      sub: admin.id,
      username: admin.email,
      role: admin.adminType,
    });
    await this.updateTokenHash(admin.id, token.access_token);
    return token;
  }
  async loginAdmin(adminLoginParam: AdminLoginParam): Promise<Tokens> {
    const user = await this.findUser(
      { email: adminLoginParam.email },
      { selectAll: true },
    );
    if (!user)
      throw new HttpException(
        'Password Or Email Is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    const isPasswordValid = await compareHash(
      adminLoginParam.password,
      user.password,
    );
    if (!isPasswordValid)
      throw new HttpException(
        'Password Or Email Is incorrect',
        HttpStatus.UNAUTHORIZED,
      );
    const token = await this.getTokens({
      sub: user.id,
      username: user.email,
      role: user.adminType,
    });
    await this.updateTokenHash(user.id, token.access_token);
    return token;
  }

  async initApp(): Promise<boolean> {
    const count = await this.adminRepository.count();
    return count === 0;
  }

  //   Find User
  findUser(
    findUserParams: FindeAdminParams,
    options?: FindUserOptions,
  ): Promise<Admin> {
    const selections: (keyof Admin)[] = [
      'id',
      'firstName',
      'lastName',
      'phoneNumber',
      'email',
      'adminType',
      'token',
    ];
    const selectionsWithPassword: (keyof Admin)[] = [...selections, 'password'];
    return this.adminRepository.findOne({
      where: { ...findUserParams },
      select: options?.selectAll ? selectionsWithPassword : selections,
    });
  }
  // Find All Admins Method
  async findAllAdmins(
    pageParams: PageQuery,
    filterQuery: FilterQuery,
  ): Promise<PageResponse> {
    const { page, perPage } = pageParams;
    // Page
    const skip = (page - 1) * perPage;
    let whereClause = {};
    // If Looking For Role
    if (filterQuery.role.length !== 0) {
      whereClause = { adminType: In(filterQuery.role) };
    }

    const [admins, count] = await this.adminRepository.findAndCount({
      select: [
        'id',
        'firstName',
        'lastName',
        'phoneNumber',
        'email',
        'adminType',
      ],
      where: whereClause,
      skip,
      take: perPage,
    });

    return {
      admins,
      total: count,
      pages: Math.ceil(count / perPage),
    };
  }

  async getTokens({ sub, username, role }: JwtPayload): Promise<Tokens> {
    const jwtPayload = {
      sub,
      username,
      role,
    };

    const [at] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '30d',
      }),
    ]);

    return {
      access_token: at,
    };
  }
  async deleteAdmin(id: number) {
    const user = await this.findUser({ id });
    if (!user) throw new HttpException(' User Not Found', HttpStatus.NOT_FOUND);
    if (user?.adminType === ROLES.SuperAdmin)
      throw new HttpException(
        ' You Can Not Delete Super Admin',
        HttpStatus.BAD_REQUEST,
      );
    await this.adminRepository.delete(id);
  }

  async updateAdmin(id: number, update: Partial<Admin>) {
    const isSuperUser = await this.findUser({ id });
    if (!isSuperUser)
      throw new HttpException(' User Not Found', HttpStatus.NOT_FOUND);

    switch (true) {
      case Object.keys(update).length === 0:
        throw new HttpException(
          'Update payload is empty',
          HttpStatus.BAD_REQUEST,
        );
      case update.password === null:
        throw new HttpException(
          'Cannot Updating  Password',
          HttpStatus.BAD_REQUEST,
        );
      case update.adminType === ROLES.Admin &&
        isSuperUser.adminType !== ROLES.Admin:
        throw new HttpException(
          'You Can Update Your Role',
          HttpStatus.BAD_REQUEST,
        );
    }

    await this.adminRepository.update(id, { ...update });
    const updateAdmin = await this.adminRepository.findOne({ where: { id } });
    const payload: JwtPayload = {
      sub: updateAdmin.id,
      username: updateAdmin.email,
      role: updateAdmin.adminType,
    };
    return this.getTokens(payload);
  }
  async isValidToken(payload: JwtPayload): Promise<boolean> {
    const isToken = await this.adminRepository.findOne({
      where: { id: payload.sub },
      select: ['token'],
    });
    if (!isToken) return false;
    return true;
  }

  async updateTokenHash(id: number, at: string): Promise<void> {
    const hashToken = await argon.hash(at);
    await this.adminRepository.update(id, { token: hashToken });
  }
}
