import express from "express";

import { isAdmin } from "../middlewares/auth.js";
import { 
    createPayment,
    createCoupon,
    applyDiscount,
    getAllCoupons,
    deleteCoupon
} from "../controllers/payment.js";

const paymentRoute = express.Router();

// route - api/v1/payment/pay
paymentRoute.post("/pay", createPayment);

// route - api/v1/payment/coupon/new
paymentRoute.post("/coupon/new", isAdmin, createCoupon);

// route - api/v1/payment/discount
paymentRoute.get("/discount", applyDiscount);

// route - api/v1/payment/coupon/all
paymentRoute.get("/coupon/all", isAdmin, getAllCoupons);

// route - api/v1/payment/discount
paymentRoute.delete("/coupon/:id", isAdmin, deleteCoupon);

export default paymentRoute;