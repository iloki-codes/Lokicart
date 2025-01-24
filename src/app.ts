import express, { NextFunction, Request, Response } from "express";

import { connectDB } from "./utils/features.js";
import { errorMiddleware } from "./middlewares/error.js";
import NodeCache from "node-cache";

// Importing Routes

import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";


connectDB();

export const nodeCache = new NodeCache();

const app = express();

app.use(express.json());

const port = 4000;

app.get("/", (req:Request, res:Response) => {
    res.send("API working with /api/v1");
});


// Using Routes

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);


app.use("/uploads", express.static("uploads"));

app.use(errorMiddleware);

app.listen(port, () => {
    console.log(`Server is working on http://localhost:${port}`);
});