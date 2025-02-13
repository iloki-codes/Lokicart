import { Request, Response, NextFunction } from "express";

import { Coupon } from "../models/coupon.js";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { nodeCache, stripe } from "../app.js";

export const createPayment = TryCatch (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { amount } = req.body;

        if(!amount) return next(new ErrorHandler("No amount found in order details", 404));

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: "INR"
        });

        return res.status(201).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            message: `Payment Intent created succesfully`
        })
    }
)

export const createCoupon = TryCatch (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { couponCode, amount } = req.body;

        if(!couponCode || !amount) return next(new ErrorHandler("coupon/amount not available", 404));

        await Coupon.create({ couponCode, amount });

        return res.status(201).json({
            success: true,
            message: `Coupon ${couponCode} created succesfully`
        })
    }
)

export const applyDiscount = TryCatch (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { couponCode } = req.query;

        const discount = await Coupon.findOne({ couponCode });

        if (!discount) return next(new ErrorHandler("Invalid Coupon Code", 400));

        return res.status(200).json({
            success: true,
            discount: discount.amount
        });
    }
)

export const getAllCoupons = TryCatch (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const coupons = await Coupon.find({});

        return res.status(200).json({
            success: true,
            coupons
        });
    }
);

export const deleteCoupon = TryCatch (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { id } = req.params;
        const coupon = await Coupon.findByIdAndDelete(id);

        if(!coupon) return next(new ErrorHandler("Invalid Coupon ID", 400));

        return res.status(200).json({
            success: true,
            message: `Coupon ${coupon?.couponCode} Deleted Successfully`
        });
    }
);