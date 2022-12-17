export type CredentialsParams = {
  email: string;
  password: string;
};
export type CreateCredentialsParams = {
  email?: string;
  phoneNumber?: string;
  password?: string;
  firstName: string;
  lastName: string;
};

export type Tokens = { refresh_token: string; access_token: string };

export type JwtPayload = {
  email: string;
  sub: number;
};
