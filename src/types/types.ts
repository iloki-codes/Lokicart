import { Request, Response, NextFunction } from "express";

export interface ProcessEnv{
    PORT: string;
    MONGODB_URL: string;
}

export interface NewUserReqBody {
    _id: string;
    name: string;
    email: string;
    photo: string;
    gender: string;
    dob: Date;
}


export interface NewProductReqBody {
    name: string;
    price: number;
    stock: number;
    category: string;
    photo: File,
}
export interface BaseQuery {
    name?: {
        $regex: string;
        $options: string;
    };
    price?: { $lte: number };
    category?: string;
}

export type SearchReqQuery = {
    search?: string;
    price?: string;
    sort?: string;
    category?: string;
    page?: string;
    limit?: number;
}


export type Controller = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void | Response<any, Record<string, any>>>;


export type InvalidateCacheProps = {
    product?: boolean;
    order?: boolean;
    admin?: boolean;
    userId?: string;
    orderId?: string;
    productId?: string | string[];
}

export type OrderItemType = {
    name: string;
    photo: string;
    price: number;
    quantity: number;
    productId: string;
}

export type ShippingInfoType = {
    address: string;
    city: string;
    state: string;
    country: string;
    pinCode: number;
}

export interface NewOrderReqBody {
    shippingInfo : ShippingInfoType;
    user: string;
    subtotal: number;
    tax: number;
    shippingCharges: number;
    discount: number;
    total: number;
    orderItems: OrderItemType[];
}