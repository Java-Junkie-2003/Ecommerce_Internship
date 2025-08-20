import { ApiService } from "@/lib/api";
import { DefaultDTO } from "@/types/dto";
import { Category } from "@/types/model/category";
import { ENDPOINTS } from "@/utils/api.endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCategories = createAsyncThunk<Category[]>('categories/fetch', async () => {
    try {
        const response: DefaultDTO = await ApiService.get(ENDPOINTS.CATEGORY.FETCH_ALL);
        if (response.statusCode !== 200) {
            throw new Error('Network response was not ok');
        }
        return response.metadata as Category[];
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
});

export const createCategory = createAsyncThunk<Category, Partial<Category>>('categories/create', async (categoryData) => {
    try {
        const response: DefaultDTO = await ApiService.post(ENDPOINTS.CATEGORY.CREATE, categoryData);
        if (response.statusCode !== 200) {
            throw new Error('Network response was not ok');
        }
        return response.metadata as Category;
    } catch (error) {
        console.error('Error creating category:', error);
        throw error;
    }
});
