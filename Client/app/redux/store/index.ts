import { configureStore } from "@reduxjs/toolkit";
import sampleSlice from "@/redux/slices/sampleSlice";
import userSlice from "@/redux/slices/user";

export const store = configureStore({
  reducer: {
    user: userSlice,
  },
});

// Type hỗ trợ cho useSelector và useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
