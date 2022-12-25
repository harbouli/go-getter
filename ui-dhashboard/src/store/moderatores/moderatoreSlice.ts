import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModeratorType } from "utils/types/RespondType";
import { CreateModeratorThunk } from "./moderatorsThunk";

type InitialState = {
  CreateUser?: string;
  error?: string;
  updateUserID?: number;
  moderator?: ModeratorType;
};
const initialState: InitialState = {
  CreateUser: "",
  error: "",
};

export const ModeratorsSlice = createSlice({
  name: "moderators",
  initialState,
  reducers: {
    setErrorMessage: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    UpdateUser: (state, action: PayloadAction<number>) => {
      state.updateUserID = action.payload;
    },
    setUser: (state, action: PayloadAction<ModeratorType>) => {
      state.moderator = { ...action.payload, token: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(CreateModeratorThunk.fulfilled, (state, action) => {
        state.CreateUser = "success";
      })
      .addCase(CreateModeratorThunk.rejected, (state, action: any) => {
        const errors = action.payload.message;
        if (Array.isArray(errors)) {
          state.error = action.payload.message[0];
        } else if (typeof errors === "string")
          state.error = action.payload.message;
        else state.error = "Somthing Went Wrrong";
      });
  },
});
export const { setErrorMessage, UpdateUser, setUser } = ModeratorsSlice.actions;
export default ModeratorsSlice.reducer;
