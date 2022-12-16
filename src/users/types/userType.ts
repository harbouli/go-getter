export type CreateUserParameters = {
  firstName: string;
  lastName: string;
  password: string;
  authType: string;
  email?: string;
  phoneNumber?: string;
};

// authType : phoneAuth || googleAuth || emailAuth
