export type CreateUserParameters = {
  firstName: string;
  lastName: string;
  password?: string;
  authType: string;
  email?: string;
  phoneNumber?: string;
};

// authType : phoneAuth || googleAuth || emailAuth

export type FindUserParameters = Partial<{
  id?: number;
  email?: string;
  phoneNumber?: string;
}>;

export type FindUserOptions = Partial<{
  selectAll: boolean;
}>;
