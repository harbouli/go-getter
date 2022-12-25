import { createAsyncThunk } from "@reduxjs/toolkit";
import { createAdmin } from "utils/api";
import { createUserParam } from "utils/types/Reqtype";

export const CreateModeratorThunk = createAsyncThunk(
  "admins/create",
  async (
    data: createUserParam,
    { dispatch, getState, rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const response = await createAdmin(data);

      return response;
    } catch (error: any) {
      throw rejectWithValue(error.response.data);
    }
  }
);
