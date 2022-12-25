import { configureStore } from "@reduxjs/toolkit";
import Moderators from "./moderatores/moderatoreSlice";
// import pricingReducer from "./modiratores/rateSlice";
export const store = configureStore({
  reducer: {
    moderator: Moderators,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
