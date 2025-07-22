import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { NewOrderReqBody } from "../types/types.js";
import { Order } from "../models/order.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { nodeCache } from "../app.js";

export const newOrder = TryCatch (
    async (
        req: Request<{}, {}, NewOrderReqBody>,
        res: Response,
        next: NextFunction
    ) => {

        const {
            shippingInfo,
            orderItems,
            user,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total
        } = req.body;

        console.log(req.body);

        if (
            !shippingInfo ||
            !orderItems?.length ||
            !user ||
            !subtotal ||
            !tax ||
            !shippingCharges ||
            !discount ||
            !total
        )
            return next(new ErrorHandler("Please enter all the fields", 400));

        const order = await Order.create({
            shippingInfo,
            orderItems,
            user,
            subtotal,
            tax,
            shippingCharges,
            discount,
            total
        });

        await reduceStock(orderItems);

        invalidateCache({
            product: true,
            order: true,
            admin: true,
            userId: user,
            productId: order.orderItems.map( (i) => String(i.productId) )
        });

        return res.status(201).json({
            success: true,
            message: "Order Placed Succesfully",
        })
    }
)

export const myOrders = TryCatch (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { id:user } = req.query;

        const key = `order-${user}`;

        let orders = [];

        if (nodeCache.has(key)) {
            orders = JSON.parse(nodeCache.get(key) as string);
        }
        else {
            orders = await Order.find({ user });
            nodeCache.set(key, JSON.stringify(orders));
        }
        return res.status(200).json({
            success: true,
            orders
        })
    }
)

export const getAllOrders = TryCatch (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const key = `all-orders`;

        let orders = [];

        if (nodeCache.has(key)) {
            orders = JSON.parse(nodeCache.get(key) as string);
        }
        else {
            orders = await Order.find().populate("user", "name");
            nodeCache.set(key, JSON.stringify(orders));
        }
        return res.status(200).json({
            success: true,
            orders
        })
    }
)

export const getOrderDetails = TryCatch (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { id } = req.params;

        const key = `order-details-${id}`;

        let order;

        if (nodeCache.has(key)) {
            order = JSON.parse(nodeCache.get(key) as string);
        }
        else {
            order = await Order.findById(id).populate("user", "name");

            if(!order) return next(new ErrorHandler("Order not found", 404));

            nodeCache.set(key, JSON.stringify(order));
        }
        return res.status(200).json({
            success: true,
            order
        });
    }
)

export const processOrder = TryCatch (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { id } = req.params;

        const order = await Order.findById(id);

        if(!order) return next(new ErrorHandler("Unable to find the order", 404));

        switch(order.status) {
            case "Processing": order.status="Shipped";
            break;

            case "Shipped": order.status="On the way";
            break;

            case "On the way": order.status="Delivered";
            break;

            default: order.status="Processing";
            break;
        }

        await order.save();

        invalidateCache({ product: false, order: true, admin: true, userId: order.user });

        return res.status(200).json({
            success: true,
            message: order.status
        });
    }
);

export const deleteOrder = TryCatch (
    async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        const { id } = req.params;

        const order = await Order.findById(id);

        if(!order) return next(new ErrorHandler("Unable to find the order", 404));

        await order.deleteOne();

        invalidateCache({
            product: false,
            order: true,
            admin: true,
            userId: order.user,
            orderId: String(order._id)
        });

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully"
        })
    }
)