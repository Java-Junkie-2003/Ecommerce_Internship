import { ApiService } from "@/lib/api";
import { FindInventoryDTO } from "@/types/dto/product.dto";
import { ENDPOINTS } from "@/utils/api.endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const findInventory = createAsyncThunk<FindInventoryDTO, string>('inventory/fetch', async (id: string) => {
    try {
        const response: FindInventoryDTO = await ApiService.get(ENDPOINTS.PRODUCT.STOCK(id));
        if (response.statusCode !== 200) {
            throw new Error('Network response was not ok');
        }
        return response as FindInventoryDTO;
    } catch (error) {
        console.error('Error fetching inventory:', error);
        throw error;
    }
});