import * as bcrypt from 'bcrypt';
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}
export async function compareHash(rawPassword: string, hashedPassword: string) {
  return bcrypt.compare(rawPassword, hashedPassword);
}

export const otp = Math.floor(1000 + Math.random() * 9000);
