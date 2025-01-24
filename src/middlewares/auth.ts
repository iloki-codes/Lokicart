import { User } from "../models/user.js";
import { TryCatch } from "./error.js";
import ErrorHandler from "../utils/utility-class.js";


// for admin only
export const isAdmin = TryCatch(async (req, res, next) => {

    const { id } = req.query;

    if (!id) return next(new ErrorHandler("Please Login First", 401));

    const user = await User.findById(id);

    if (!user) return next(new ErrorHandler("Unable to find user", 401));

    if (user.role !== "admin") return next(new ErrorHandler("Unable to process the function, call admin", 401));

    next();
});