
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/types/redux";
import { Brand } from "@/types/model/brand";
import { createBrand, fetchBrands } from "../thunks/brand.thunk";

interface BrandState extends RootState {
  brands: Brand[];
}

const initialState: BrandState = {
    brands: [],
    error: null,
    status: "idle"
};

const brandSlice = createSlice({
    name: "brand",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = "idle";
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchBrands.fulfilled, (state, action) => {
            state.brands = action.payload;
            state.status = "idle";
        });
        builder.addCase(fetchBrands.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(fetchBrands.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message || null;
        });
        builder.addCase(createBrand.fulfilled, (state, action) => {
            state.brands.push(action.payload);
            state.status = "succeeded";
        });
        builder.addCase(createBrand.pending, (state) => {
            state.status = "loading";
        });
        builder.addCase(createBrand.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.error.message || null;
        });
    },
});

export default brandSlice.reducer;
