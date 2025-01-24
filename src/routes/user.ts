import express, { Request, Response } from "express";
import { newUser, getAllUsers, getUser, deleteUser } from "../controllers/user.js";
import { isAdmin } from "../middlewares/auth.js";

const userRoute = express.Router();

// route - /api/v1/user/new
userRoute.post("/new", newUser);

// route - /api/v1/user
userRoute.get("/", (req: Request, res: Response) => {
    res.send("GET req working");
});

// route - /api/v1/user/all
userRoute.get("/all", isAdmin, getAllUsers);

// route - /api/v1/user/dynamicId
userRoute.get("/:id", getUser);

userRoute.delete("/:id", isAdmin, deleteUser);

export default userRoute;