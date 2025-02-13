import express, { NextFunction, Request, Response } from "express";

import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";

// Importing Routes

import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import statsRoute from "./routes/admindata.js";
import Stripe from "stripe";


config({
    path: "./.env",
});

const port = process.env.PORT || 4000;
const db_uri = process.env.MONGODB_URL || "";
const stripeKey = process.env.STRIPE_KEY || "";

connectDB(db_uri);

export const stripe = new Stripe(stripeKey);

export const nodeCache = new NodeCache();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req:Request, res:Response) => {
    res.send("API working with /api/v1");
});

// Using Routes

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/dashboard", statsRoute);

app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});