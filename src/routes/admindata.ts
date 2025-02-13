import express from "express";
import { isAdmin } from "../middlewares/auth.js";

import {
    getDashboardStats,
    getPieCharts,
    getBarCharts,
    getLineCharts
} from "../controllers/admindata.js";


const statsRoute = express.Router();

// route - /api/v1/dashboard/stats
statsRoute.get("/stats", isAdmin, getDashboardStats);

// route - /api/v1/dashboard/pie
statsRoute.get("/pie", isAdmin, getPieCharts);

// route - /api/v1/dashboard/bar
statsRoute.get("/bar", isAdmin, getBarCharts);

// route - /api/v1/dashboard/line
statsRoute.get("/line", isAdmin, getLineCharts);

export default statsRoute;