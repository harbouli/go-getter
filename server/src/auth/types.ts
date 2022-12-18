export type CredentialsParams = {
  email: string;
  password: string;
};
export type CreateUserParams = {
  email?: string;
  phoneNumber?: string;
  password?: string;
  firstName: string;
  lastName: string;
};

export type Tokens = { refresh_token: string; access_token: string };

export type JwtPayload = {
  username: string;
  sub: number;
};
export type rfTokenParam = {
  userId: number;
  rt: string;
};
