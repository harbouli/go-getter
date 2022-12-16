import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class Users {
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
  @Column({ nullable: true })
  email?: string;
  // AuthType
  @Column({ name: 'auth_type' })
  authType: string;
  // Password
  @Column()
  password: string;
}
