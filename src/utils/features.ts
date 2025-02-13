import mongoose from "mongoose";
import { InvalidateCacheProps, OrderItemType } from "../types/types.js";
import { nodeCache } from "../app.js";
import { Product } from "../models/product.js";
import { Order } from "../models/order.js";

export const connectDB = (uri: string) => {

  mongoose
    .connect(uri)
    .then((c) => console.log("DB Connected succesfully"))
    .catch((e) => console.log(e));
};


export const invalidateCache = (
  {product, order, admin, productId, userId, orderId}: InvalidateCacheProps
) => {
  
  if(product) {

    const productKeys: string[] = [
      "most-bought-products",
      "all-products", 
      "categories", 
      `product-${productId}`
    ];
    
    if (typeof productId === "string") productKeys.push(`product-${productId}`);

    if (typeof productId === "object") 

      productId.forEach((i) => productKeys.push(`product-${i}`));

    nodeCache.del(productKeys);
  
  }

  if(order) {

    const orderKeys: string[] = ["getAllOrders",`order-${userId}`, `order-${orderId}`];

    nodeCache.del(orderKeys);
  
  }

  if(admin){

    nodeCache.del([
      "admin-stats",
      "admin-pie-charts",
      "admin-bar-charts",
      "admin-line-charts"
    ])
  }
}


export const reduceStock = async (orderItems:OrderItemType[]) => {

  for (let i=0; i < orderItems.length; i++) {
    const order = orderItems[i];
    const product = await Product.findById(order.productId);
    if(!product) throw new Error("Product not found");
      product.stock -= order.quantity;
      await product.save();
  }
};

export const calculatePercentage = (thisMonth: number, lastMonth: number) => {

  if(lastMonth ===0) return thisMonth*100;
  const percent = ((thisMonth) / lastMonth ) * 100;  // relative%(thisMonth - lastMonth)) & absolute% this
  return Number(percent.toFixed(0));

};

interface MyDocument {     // extends Document not needed cuz TS expecting object instead of mongoose doc
  createdAt: Date;
  discount?: number;
  total?: number;
}

type FuncProps = { 
  length: number; 
  today: Date; 
  docArr: MyDocument[];
  property?: "discount" | "total";
};

export const getChartData = ( { length, today, docArr, property } : FuncProps ) => {
  
  const data: number[] = new Array(length).fill(0);

  docArr.forEach((i) => {
      const creationDate = i.createdAt;
      const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;  // year change issue

      if (monthDiff < length) {
          data[length - monthDiff - 1] += property ? i[property]! : 1; // discount not null
      }
  
  });

  return data;

};