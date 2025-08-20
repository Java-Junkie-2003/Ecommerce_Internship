
import { createSlice } from "@reduxjs/toolkit";
import { Category } from "@/types/model/category";
import { RootState } from "@/types/redux";
import { createCategory, fetchCategories } from "@/redux/thunks/category.thunk";

interface CategoryState extends RootState {
  categories: Category[];
}

const initialState: CategoryState = {
    categories: [],
    error: null,
    status: "idle"
};

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = "idle";
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCategories.fulfilled, (state, action) => {
            state.categories = action.payload;
            state.status = "idle";
        });
        builder.addCase(fetchCategories.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(fetchCategories.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message || null;
        });
        builder.addCase(createCategory.fulfilled, (state, action) => {
            state.categories.push(action.payload);
            state.status = "succeeded";
        });
        builder.addCase(createCategory.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(createCategory.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message || null;
        });
    },
});

export default categorySlice.reducer;
