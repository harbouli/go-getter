import { ROLES } from "utils/constant";

export type createUserParam = {
  adminType: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
};

export type UpdateUserPayLoad = {
  firstName?: string;
  lastName?: string;
  email?: string;
  adminType?: string;
  phoneNumber?: string;
};
export type UserCredentials = {
  email: string;
  password: string;
};
