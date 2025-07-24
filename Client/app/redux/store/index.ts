import { configureStore } from "@reduxjs/toolkit";
import sampleSlice from "~/redux/slices/sampleSlice";

export const store = configureStore({
  reducer: {
    counter: sampleSlice,
  },
});

// Type hỗ trợ cho useSelector và useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
