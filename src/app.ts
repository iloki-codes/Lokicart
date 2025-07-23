import express, { Request, Response } from "express";

import cors from "cors";
import { config } from "dotenv";
import morgan from "morgan";
import NodeCache from "node-cache";
import { errorMiddleware } from "./middlewares/error.js";
import { connectDB } from "./utils/features.js";

// Importing Routes

import Stripe from "stripe";
import statsRoute from "./routes/admindata.js";
import orderRoute from "./routes/order.js";
import paymentRoute from "./routes/payment.js";
import productRoute from "./routes/product.js";
import userRoute from "./routes/user.js";


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
    origin: [ "https://lokicart-mern.netlify.app/", "http://localhost:5173" ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));


app.options("*", (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "https://lokicart-mern.netlify.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
});

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
