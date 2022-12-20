import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Admins } from 'src/utils/constant';
@Entity('admins')
export class Admin {
  @PrimaryGeneratedColumn()
  id: number;
  // FirstName
  @Column({ name: 'firstname' })
  firstName: string;
  // LastName
  @Column({ name: 'lastname' })
  lastName: string;
  // Phone Number
  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;
  // Email
  @Column()
  email: string;
  // AuthType
  @Column({ name: 'admin_type', type: 'enum', enum: Admins })
  adminType: Admins;
  // Password
  @Column({ nullable: true })
  @Exclude()
  password?: string;
}
