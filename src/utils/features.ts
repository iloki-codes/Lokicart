
import mongoose from "mongoose";
import { InvalidateCacheProps } from "../types/types.js";
import { nodeCache } from "../app.js";
import { Product } from "../models/product.js";

// const uri = process.env.MONGODB_URL;

export const connectDB = () => {
  mongoose
    .connect("mongodb+srv://loki:t3sJC7RaNYQXQ5lJ@cluster0.iwchr.mongodb.net/")
    // .connect("mongodb://localhost:27017/", {
    //     dbName: "Lokicart",
    // })
    // .then((c) => console.log(`DB Connected to ${c.connection.host}`))
    .then((c) => console.log("DB Connected succesfully"))
    .catch((e) => console.log(e));
};


export const invalidateCache = async ({product, order, admin}: InvalidateCacheProps) => {
  
  if(product) {
    const productKeys: string[] = ["most-bought-products", "all-products", "categories"];

    const products = await Product.find({}).select("_id");

    products.forEach( (i) => {
      productKeys.push(`product-${i._id}`);
    });
    
    nodeCache.del(productKeys);
  }
  if(order) {

  }
  if(admin){

  }
}