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

export const updateBrand = createAsyncThunk(
    "brand/update",
    async ({ id, brandData }: { id: string; brandData: Partial<Brand> }) => {
        try {
            const response: DefaultDTO = await ApiService.put(ENDPOINTS.BRAND.UPDATE(id), brandData);
            return response;
        }
        catch (error: any) {
            console.error("Error updating brand:", error);
            throw error;
        }
    }
);
export const disableBrand = createAsyncThunk(
    "brand/disable",
    async (id: string) => {
        try {   
            const response: DefaultDTO = await ApiService.put(ENDPOINTS.BRAND.UNPUBLISH(id));
            return response;
        } catch (error: any) {
            console.error("Error disabling brand:", error);
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