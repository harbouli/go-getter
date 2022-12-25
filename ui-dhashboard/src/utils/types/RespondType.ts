import { ROLES } from "utils/constant";

export type ModeratorType = {
  id?: number;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email: string;
  adminType: ROLES;
  token?: string;
};

export type ModeratorsRes = {
  admins: ModeratorType[];
  pages: number;
  total: number;
};
export type VerifyTokenResponse = {
  token: {
    sub: number;
    role: string;
    username: string;
  };
  valid: boolean;
};
