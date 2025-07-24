
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchSample } from "~/redux/thunks/sample.thunk";

interface CounterState {
  value: number;
}

const initialState: CounterState = { value: 0 };

const sampleSlice = createSlice({
    name: "counter",
    initialState,
    reducers: {
        increment: (state) => { state.value += 1 },
        decrement: (state) => { state.value -= 1 },
        reset: (state) => { state.value = 0 },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSample.fulfilled, (state, action) => {
            state.value = action.payload;
        });
    },
});

export const { increment, decrement, reset } = sampleSlice.actions;
export default sampleSlice.reducer;
