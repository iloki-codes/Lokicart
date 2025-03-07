import { CartItem, ShippingInfo, User } from "./types";


export interface UserReducerInitialState {
    user: User | null;
    loading: boolean;
};

export interface CartReducerInitialState {
    loading: boolean;
    cartItems: CartItem[];
    total: number;
    shippingCharges: number;
    tax: number;
    discount: number;
    subtotal: number;
    shippingInfo: ShippingInfo;
};

