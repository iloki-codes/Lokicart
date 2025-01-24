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
    page?: string,
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
}











    //  const validateEnv = (): EnvConfig => {
    //      if(!process.env.PORT || !process.env.MONGODB_URL) {
    //          throw new Error('Missing required environment variables');
    //      }
    //      return {
    //          PORT:process.env.PORT,
    //          MONGODB_URL:process.env.MONGODB_URL,
    //      };
    //  };

    //     export const config = validateEnv();
    // }