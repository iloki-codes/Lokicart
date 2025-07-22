import express, { NextFunction, Request, Response } from "express";

import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";
import { config } from "dotenv";
import morgan from "morgan";
import cors from "cors";

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
// const paymentMethodDomain = await stripe.paymentMethodDomains.create(
//   {
//     domain_name: 'http://localhost:5173/',
//   },
//   {
//     stripeAccount: '{{acct_1QsA1DB6pTrDeWNX}}',
//   }
// );

export const nodeCache = new NodeCache();

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));


// app.options("*", (req: Request, res: Response) => {
//     res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.sendStatus(200);
// });

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