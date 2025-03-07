import { CartItem, Order, Product, ShippingInfo, User } from "./types";

export type CustomError = {
    status: number;
    data: {
        message: string;
        success: boolean;
    }
};

//------------------------------------- Response types --------------------------------

export type MessageResponse = {
    success: boolean;
    message: string;
};

export type UserResponse = {
    success: boolean;
    user: User;
};

export type AllProductsResponse = {
    success: boolean;
    products: Product[];
};


export type getCategoriesResponse = {
    success: boolean;
    categories: string[];
};

export type SearchProductResponse = {
    success: boolean;
    products: Product[];
    totalPage: number;
};

export type ProductResponse = {
    success: boolean;
    product: Product;
};

export type MyOrdersResponse = {
    success: boolean;
    orders: Order[];
};

export type OrderDetailsResponse = {
    success: boolean;
    order: Order;
};

//--------------------------------------- Request types --------------------------------------- 


export type NewProductRequest = {
    id: string;
    formData: FormData;
};

export type SearchProductRequest = {
    price: number;
    page: number;
    category: string;
    search: string;
    sort: string;
};

export type UpdateProductRequest = {
    userId: string;
    productId: string;
    formData: FormData;
};

export type DeleteProductRequest = {
    userId: string;
    productId: string;
};

export type NewOrderRequest = {
    user: string;
    shippingInfo: ShippingInfo;
    orderItems: CartItem[];
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
};

export type ProcessOrderRequest = {
    userId: string;
    orderId: string;
};