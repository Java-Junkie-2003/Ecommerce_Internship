import { ApiService } from "@/lib/api";
import { DefaultDTO } from "@/types/dto";
import { Brand } from "@/types/model/brand";
import { ENDPOINTS } from "@/utils/api.endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const createBrand = createAsyncThunk(
    "brand/create",
    async (brandData: Partial<Brand>) => {
        try {
            const response: DefaultDTO = await ApiService.post(ENDPOINTS.BRAND.CREATE, brandData);
            return response.metadata;
        } catch (error: any) {
            console.error("Error creating brand:", error);
            throw error;
        }
    }
);

export const fetchBrands = createAsyncThunk(
    "brand/fetchAll",
    async () => {
        try {
            const response: DefaultDTO = await ApiService.get(ENDPOINTS.BRAND.FETCH_ALL);
            return response.metadata;
        } catch (error: any) {
            console.error("Error fetching brands:", error);
            throw error;
        }
    }
);