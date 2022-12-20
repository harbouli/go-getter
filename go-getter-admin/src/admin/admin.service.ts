import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { IAdminService } from './admin.interface';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindUserOptions, FindeAdminParams, JwtPayload, Tokens } from './types';
import { hashPassword } from 'src/utils/helper';
import { JwtService } from '@nestjs/jwt';

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
    return this.getTokens({ sub: admin.id, username: admin.email });
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
    ];
    const selectionsWithPassword: (keyof Admin)[] = [...selections, 'password'];
    return this.adminRepository.findOne({
      where: { ...findUserParams },
      select: options?.selectAll ? selectionsWithPassword : selections,
    });
  }

  async getTokens({ sub, username }: JwtPayload): Promise<Tokens> {
    const jwtPayload = {
      sub,
      username,
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

  // create(createAdminDto: CreateAdminDto) {
  //   return 'This action adds a new admin';
  // }

  // findAll() {
  //   return `This action returns all admin`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} admin`;
  // }

  // update(id: number, updateAdminDto: UpdateAdminDto) {
  //   return `This action updates a #${id} admin`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} admin`;
  // }
}
