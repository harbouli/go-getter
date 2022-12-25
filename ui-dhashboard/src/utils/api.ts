import axios from "axios";
import {
  createUserParam,
  UpdateUserPayLoad,
  UserCredentials,
} from "./types/Reqtype";
import {
  ModeratorsRes,
  ModeratorType,
  VerifyTokenResponse,
} from "./types/RespondType";
import { PaginanitionsQuery } from "./types/type";

const { REACT_APP_API_HOSTNAME_ADMIN } = process.env;

export const getAdmins = async (
  params: PaginanitionsQuery,
  cancelToken: any
) => {
  const res = await axios.get<ModeratorsRes>(
    `${REACT_APP_API_HOSTNAME_ADMIN}/admin/`,
    {
      params,
      cancelToken,
    }
  );
  return res;
};
export const getAdminById = async ({ id }: { id: number }) => {
  const res = await axios.get<ModeratorType>(
    `${REACT_APP_API_HOSTNAME_ADMIN}/admin/user/${id}`
  );
  return res;
};
export const currentUser = async (token?: string) => {
  const res = await axios.get<ModeratorType>(
    `${REACT_APP_API_HOSTNAME_ADMIN}/admin/current-user`,
    {
      ...(token && { headers: { Authorization: `Bearer ${token}` } }),
    }
  );
  return res;
};
export const updateAdmin = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateUserPayLoad;
}) => {
  const res = await axios.patch<{ token: string }>(
    `${REACT_APP_API_HOSTNAME_ADMIN}/admin/${id}`,
    payload
  );
  return res;
};
export const updateAdminForSuperAdmin = async ({
  id,
  payload,
}: {
  id: number;
  payload: UpdateUserPayLoad;
}) => {
  const res = await axios.patch<{ token: string }>(
    `${REACT_APP_API_HOSTNAME_ADMIN}/admin/update/${id}`,
    payload
  );
  return res;
};
export const createAdmin = async (payload: createUserParam) => {
  const res = await axios.post<{ token: string }>(
    `${REACT_APP_API_HOSTNAME_ADMIN}/admin/create`,
    payload
  );
  return res;
};

export const deleteModerator = async ({ id }: { id: number }) => {
  const res = await axios.delete(`${REACT_APP_API_HOSTNAME_ADMIN}/admin/${id}`);
  return res;
};

// Sign in
export const signIn = async (payload: UserCredentials) => {
  const res = await axios.post<{ access_token: string }>(
    `${REACT_APP_API_HOSTNAME_ADMIN}/auth/login`,
    payload
  );
  return res;
};

// Verify Token
export const verifyToken = async (token: string) => {
  console.log(token);
  const response = await axios.get<VerifyTokenResponse>(
    `${REACT_APP_API_HOSTNAME_ADMIN}/auth/verifyToken`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response;
};
export const logout = async () => {
  const response = await axios.get(
    `${REACT_APP_API_HOSTNAME_ADMIN}/admin/logout`
  );
  return response;
};
