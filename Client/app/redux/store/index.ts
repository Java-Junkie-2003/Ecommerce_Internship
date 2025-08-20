import { configureStore } from "@reduxjs/toolkit";
import sampleSlice from "@/redux/slices/sampleSlice";
import userSlice from "@/redux/slices/user";
import categorySlice from "@/redux/slices/category";
import brandSlice from "@/redux/slices/brand";

export const store = configureStore({
  reducer: {
    user: userSlice,
    category: categorySlice,
    brand: brandSlice,
  },
});

// Type hỗ trợ cho useSelector và useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
