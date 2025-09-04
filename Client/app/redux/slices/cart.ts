
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/types/redux";
import { Cart } from "@/types/model/cart";
import { initCart, addToCart, updateCart, deleteFromCart } from "@/redux/thunks/cart.thunk";
import { CartDTO, DeleteCartDTO } from "@/types/dto/cart.dto";
import { stat } from "fs";

interface CartState extends RootState {
  cartItems: Cart[];
  selectedCartItem: Cart[];
  count: number;
}

const initialState: CartState = {
    cartItems: [],
    selectedCartItem: [],
    count: 0,
    status: "idle",
    error: null
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = "idle";
            state.error = null;
        },
        setSelectedCartItems: (state, action: PayloadAction<Cart[]>) => {
            state.selectedCartItem = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(initCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(initCart.fulfilled, (state, action: PayloadAction<CartDTO>) => {
                state.status = "succeeded";
                state.cartItems = action.payload.metadata.cart_products;
                state.count = state.cartItems.length;
            })
            .addCase(initCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error?.message ?? null;
            })
            .addCase(addToCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartDTO>) => {
                state.status = "succeeded";
                state.cartItems = action.payload.metadata.cart_products;
                state.count = action.payload.metadata.cart_products.length;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error?.message ?? null;
            })
            .addCase(deleteFromCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteFromCart.fulfilled, (state, action: PayloadAction<DeleteCartDTO>) => {
                state.status = "succeeded";
                state.cartItems = state.cartItems.filter(item => item.productId !== action.payload.metadata.productId);
                state.count = state.count - 1;
            })
            .addCase(deleteFromCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error?.message ?? null;
            })
            .addCase(updateCart.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateCart.fulfilled, (state, action: PayloadAction<CartDTO>) => {
                state.status = "succeeded";
                state.cartItems = action.payload.metadata.cart_products;
                state.count = action.payload.metadata.cart_products.length;
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error?.message ?? null;
            });
    },
});

export const { resetStatus, setSelectedCartItems } = cartSlice.actions;

export default cartSlice.reducer;
