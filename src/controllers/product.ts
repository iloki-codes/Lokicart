import { TryCatch } from "../middlewares/error.js";
import { NextFunction, Request, Response } from "express";
import { BaseQuery, NewProductReqBody, SearchReqQuery } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { Product } from "../models/product.js";
import { rm } from "fs";
import { nodeCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";
// import { faker } from "@faker-js/faker";

export const getProduct = TryCatch(

    async (
        req: Request,
        res: Response,
        next: NextFunction
    ):Promise<void> => {

        const id = req.params.id;

        let product;

        if(nodeCache.has(`product-${id}`)) {
            product = JSON.parse(nodeCache.get(`product-${id}`) as string);
        }
        else {
            product = await Product.findById(id);
            if(!product) return next(new ErrorHandler("Unable to find the product", 404));
            nodeCache.set(`product-${id}`, JSON.stringify(product));
        }

        res.status(200).json({
            success: true,
            product,
        })
});

// revalidate on crud product/order
export const trendingProducts = TryCatch(

    async (
        req: Request,
        res: Response,
        next: NextFunction
    ):Promise<void> => {

        let products = [];

        // if(nodeCache.has("most-bought-products")) {
        //     products = JSON.parse(nodeCache.get("most-bought-products") as string);
        // }
        // else {
             products = await Product.find({}).sort({ createdAt: -1 });
             nodeCache.set("most-bought-products", JSON.stringify(products));
            //}       // check in cache if it already exists or not and is faster than searching product again

        res.status(200).json({
            success: true,
            products
        })
});


export const getAllProducts = TryCatch(

    async (
        req: Request,
        res: Response,
        next: NextFunction
    ):Promise<void> => {

        let products;

        if(nodeCache.has("all-products")) {
            products = JSON.parse(nodeCache.get("all-products") as string);
        }
        else {
            products = await Product.find({});
            nodeCache.set("all-products", JSON.stringify(products));
        }

        res.status(200).json({
            sucess: true,
            products,
    });
});


export const getCategories = TryCatch(

    async (
        req: Request,
        res: Response,
        next: NextFunction
    ):Promise<void> => {

        let categories;

        if(nodeCache.has("categories")) {
            categories = JSON.parse(nodeCache.get("categories") as string);
        }
        else {
            categories = await Product.distinct("category");
            nodeCache.set("categories", JSON.stringify(categories));
        }

        res.status(200).json({
            success: true,
            categories,
        })
});

export const newProduct = TryCatch(

    async (
        req: Request<{}, {}, NewProductReqBody>,
        res: Response,
        next: NextFunction
    ):Promise<void> => {

        const { name, price, stock, category } = req.body

        const photo = req.file;

        if(!photo) return next(new ErrorHandler("Please Add Photo", 400));

        if( !name || !price || !stock || !category){

            rm(photo.path, () => {
                console.log("deleted");
            });

            return next(new ErrorHandler("Please fill all the fields", 400));
        }

        await Product.create({
            name,
            price,
            stock,
            category: category.toLowerCase(),
            photo: photo?.path,
        });

        invalidateCache({
            product: true,
            admin: true
        });

         res.status(201).json({
            success: true,
            message: "Product created successfully",
        });
});

export const deleteProduct = TryCatch(

    async (
        req: Request,
        res: Response,
        next: NextFunction
    ):Promise<void> => {

        const id = req.params.id;

        const product = await Product.findById(id);

        if(!product) return next(new ErrorHandler("Unable to find the product", 404));

        await product.deleteOne();

        invalidateCache({
            product: true,
            productId: String(product._id),
            admin: true
        });

         res.status(200).json({
            sucess: true,
            message: "Product deleted successfully"
        });
});



export const updateProduct = TryCatch(

    async (
        req: Request,
        res: Response,
        next: NextFunction
    ):Promise<void> => {

        const { id } = req.params;
        const { name, price, stock, category } = req.body;
        const photo = req.file;

        const product = await Product.findById(id);

        if(!product) return next(new ErrorHandler("Unable to find the product", 404));

        if(photo) {
            rm(product.photo!, () => {
                console.log("Old photo deleted");
            });
            product.photo = photo.path;
        }

        if(name) product.name = name;
        if(price) product.price = price;
        if(stock) product.stock = stock;
        if(category) product.category = category;


        await product.save();

        invalidateCache({
            product: true,
            productId: String(product._id),
            admin: true
        });

         res.status(200).json({
            sucess: true,
            message: "Product updated successfully",
        });
});




export const searchProduct = TryCatch(

    async (
        req: Request<{}, {}, {}, SearchReqQuery>,
        res: Response,
        next: NextFunction
    ):Promise<void> => {

        const { search, sort, price, category } = req.query;

        const page = Number(req.query.page) || 1;

        if (page || search || sort || price || category) {

        const limit = Number(process.env.PRODUCT_PER_PAGE) || 20; // first page with 5 products

        const skip = (page - 1) * limit;    // skip 5 products and show products after that

        const baseQuery:BaseQuery = {};

            if(search)
                baseQuery.name = {
                    $regex: search,
                    $options: "i", // insensitive
                };

            if(price)
                baseQuery.price = {
                    $lte: Number(price)
                };

            if(category)
                baseQuery.category=category;

            const productsPromise = await Product.find(baseQuery).sort(
                sort && price ? { price: sort === "asc" ? 1 : -1 } : {}
            ).limit(limit).skip(skip);

        const [products, filteredProducts] = await Promise.all([
            productsPromise,
            Product.find(baseQuery)
        ]);

        console.log(filteredProducts);

        const totalPage = limit ? Math.ceil(filteredProducts.length / limit) : 1;
                                                        // ceil(upper limit) opp. of floor(lower limit)

        if(!products) return next(new ErrorHandler("Unable to find the product", 404));

        res.status(200).json({
            success: true,
            products,
            totalPage,
        })
    }
});
