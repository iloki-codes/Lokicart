import { Bar, CartItem, Line, Order, Pie, Product, ShippingInfo, Stats, User } from "./types";

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


export type AllUsersResponse = {
    success: boolean;
    users: User[];
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

export type StatsResponse = {
    success: boolean;
    stats: Stats;
};

export type PieResponse = {
    success: boolean;
    charts: Pie;
};

export type BarResponse = {
    success: boolean;
    charts: Bar;
};

export type LineResponse = {
    success: boolean;
    charts: Line;
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
    limit?: number;
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
    orderId: string;
    userId: string;
};


export type DeleteUserRequest = {
    userId: string,
    adminUserId: string
};