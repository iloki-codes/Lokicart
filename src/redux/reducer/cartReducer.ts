import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartReducerInitialState } from "../../types/reducer.types";
import { CartItem, ShippingInfo } from "../../types/types";

const initialState: CartReducerInitialState = {
    loading: false,
    cartItems: [],
    total: 0,
    shippingCharges: 0,
    tax: 0,
    discount: 0,
    subtotal: 0,
    shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: ""
    }
};

export const cartReducer = createSlice({
    name: "cartReducer",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<CartItem>) => {
            state.loading = true;

            const index = state.cartItems.findIndex((i) => i.productId === action.payload.productId);

            if (index!== -1) state.cartItems[index] = action.payload;

            else state.cartItems.push(action.payload);
            state.loading = false;
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.loading = true;
            state.cartItems = state.cartItems.filter(
                (i) => i.productId !== action.payload       //a != b, then new array will form with new array with remaining products
            );
            state.loading = false;
        },
        amountSection: (state) => {
            let subtotal = 0;

            for (let i = 0; i < state.cartItems.length; i++) {
                const item = state.cartItems[i];

                subtotal += item.price * item.quantity;
            }

            state.subtotal = subtotal;
            state.shippingCharges = state.subtotal > 1000 ? 0 : 99;
            state.tax = Math.round(state.subtotal * 0.18);
            state.total = state.subtotal + state.tax + state.shippingCharges - state.discount;
        },
        applyDiscount: (state, action: PayloadAction<number>) => {
            state.discount = action.payload;
        },
        saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
            state.shippingInfo = action.payload;
        },
        resetCart: () => initialState,
    }
});

export const { addToCart, removeFromCart, amountSection, applyDiscount, saveShippingInfo, resetCart } = cartReducer.actions;