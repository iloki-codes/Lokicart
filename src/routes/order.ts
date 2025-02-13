import express, { Request, Response } from "express";
import { 
    newOrder,
    myOrders,
    getAllOrders, 
    getOrderDetails, 
    deleteOrder,
    processOrder
} from "../controllers/order.js";

import { isAdmin } from "../middlewares/auth.js";

const orderRoute = express.Router();

// route - /api/v1/order
orderRoute.get("/", (req: Request, res: Response) => {
    res.send("GET req working");
});

// route - /api/v1/order/new
orderRoute.post("/new", newOrder);

// route - /api/v1/order/myorder
orderRoute.get("/my", myOrders);

// route - /api/v1/order/all
orderRoute.get("/all", isAdmin, getAllOrders);

// // route - /api/v1/order/dynamicId
orderRoute.get("/:id", getOrderDetails);

orderRoute.put("/:id", isAdmin, processOrder);

orderRoute.delete("/:id", isAdmin, deleteOrder);

export default orderRoute;