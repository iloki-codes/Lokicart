import express, { Request, Response } from "express";
import { isAdmin } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
import { newProduct, 
        trendingProducts,
        searchProduct, 
        getAllProducts, 
        getCategories, 
        getProduct,
        updateProduct, 
        deleteProduct 
    } from "../controllers/product.js";


const productRoute = express.Router();

// route - /api/v1/product/new
productRoute.post("/new", singleUpload, newProduct);

//route - /api/v1/product/trending
productRoute.get("/trending", trendingProducts);

// route - /api/v1/product
productRoute.get("/", (req: Request, res: Response) => {
    res.send("GET req working");
});


// route - /api/v1/product/search
productRoute.get("/search", searchProduct);

// route - /api/v1/product/all
productRoute.get("/all", isAdmin, getAllProducts);

// route - /api/v1/product/categories
productRoute.get("/categories", getCategories);

// route - /api/v1/product/dynamic ID
productRoute.get("/:id", getProduct);

productRoute.put("/:id",isAdmin, singleUpload, updateProduct);

productRoute.delete("/:id", isAdmin, deleteProduct);

export default productRoute;