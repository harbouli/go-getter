export type FindeAdminParams = Partial<{
  email?: string;
  id?: number;
  phoneNumber?: string;
}>;
export type FindUserOptions = Partial<{
  selectAll: boolean;
}>;
export type Tokens = { access_token: string };

export type JwtPayload = {
  username: string;
  sub: number;
};
