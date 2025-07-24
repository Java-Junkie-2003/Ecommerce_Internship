import { createAsyncThunk } from '@reduxjs/toolkit';

// Example async function (replace with your API call)
const fetchSampleData = async (id: number) => {
    const response = await fetch(`/api/sample/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

// Sample asyncThunk
export const fetchSample = createAsyncThunk(
    'sample/fetchSample',
    async (id: number, thunkAPI) => {
        try {
            const data = await fetchSampleData(id);
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);