import { ReactElement } from "react";

export type User = {
    name: string;
    email: string;
    _id: string;
    photo: string;
    role: string;
    gender?: string;
    dob?: Date;
};

export type Product = {
    name: string;
    price: number;
    _id: string;
    photo: string;
    stock: number;
    category: string;
};

export type ProductProps = {
    productId: string;
    photo: string;
    name: string;
    price: number;
    stock: number;
    handler: (cartItem: CartItem) => string | undefined;
};

export interface PropsType {
    user: User | null
};

export interface Props {
    children?: ReactElement,
    isAuthenticated: boolean,
    adminRoute?: boolean,
    isAdmin?: boolean,
    redirect?: string,
}

export type ShippingInfo = {
    address: string;
    city: string;
    pinCode: string;
    country: string;
    state: string;
};

export type CartItem = {
    productId: string;
    quantity: number;
    photo: string;
    name: string;
    price: number;
    stock: number;
}

export type CartItemProps = {
    cartItem: CartItem;
    incrementHandler: (cartItem: CartItem) => void;
    decrementHandler: (cartItem: CartItem) => void;
    removeHandler: (id: string) => void;
}

export type OrderItem = Omit<CartItem, "stock"> & { _id: string };

export type Order = { 
    orderItems: OrderItem[];
    shippingInfo: ShippingInfo;
    subtotal: number;
    shippingCharges: number;
    tax: number;
    discount: number;
    total: number;
    status: string;
    user: {
        name: string;
        _id: string;
    };
    _id: string;
};