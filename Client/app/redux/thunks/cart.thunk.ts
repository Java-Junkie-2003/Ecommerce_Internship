import { ApiService } from "@/lib/api";
import { DefaultDTO } from "@/types/dto";
import { CartDTO, DeleteCartDTO } from "@/types/dto/cart.dto";
import { ENDPOINTS } from "@/utils/api.endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const initCart = createAsyncThunk<CartDTO>(
    "cart/init",
    async () => {
        try {
            const response: DefaultDTO = await ApiService.get(ENDPOINTS.CART.INIT);
            return response as CartDTO;
        } catch (error: any) {
            console.error("Error initializing cart:", error);
            throw error;
        }
    }
);

export const addToCart = createAsyncThunk<CartDTO, { productId: string; quantity: number }>(
    "cart/add",
    async ({ productId, quantity }) => {
        try {
            const response: DefaultDTO = await ApiService.post(ENDPOINTS.CART.ADD, { productId, quantity });
            if(response.status === 'error') {
                throw new Error(response.message);
            }
            return response as CartDTO;
        } catch (error: any) {
            console.error("Error adding to cart:", error);
            throw error;
        }
    }
);

export const updateCart = createAsyncThunk<CartDTO, { productId: string; quantity: number; old_quantity: number }>(
    "cart/update",
    async ({ productId, quantity, old_quantity }) => {
        try {
            const response: DefaultDTO = await ApiService.put(ENDPOINTS.CART.UPDATE, { productId, quantity, old_quantity });
            return response as CartDTO;
        } catch (error: any) {
            console.error("Error updating cart:", error);
            throw error;
        }
    }
);

export const deleteFromCart = createAsyncThunk<DeleteCartDTO, { productId: string }>(
    "cart/delete",
    async ({ productId }) => {
        try {
            const response: DefaultDTO = await ApiService.delete(ENDPOINTS.CART.DELETE(productId));
            const result = response as DeleteCartDTO;
            result.metadata.productId = productId;
            return result;
        } catch (error: any) {
            console.error("Error deleting from cart:", error);
            throw error;
        }
    }
);