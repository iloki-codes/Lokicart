import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { Controller } from "../types/types.js";


export const errorMiddleware = (
    err: ErrorHandler, 
    req: Request, 
    res: Response, 
    next: NextFunction
):void => {
    
    err.message ||= "Internal Server Error";
    err.statusCode ||= 500;

    if(err.name==="CastError") err.message = "Invalid ID";

     res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}


export const TryCatch = (func: Controller) => {

    return (req: Request, res: Response, next: NextFunction) => {

        Promise.resolve(func(req, res, next)).catch(next);
    }
}
