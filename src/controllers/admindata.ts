import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { nodeCache } from "../app.js";
import { Product } from "../models/product.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import { calculatePercentage, getChartData, MyDocument } from "../utils/features.js";

export const getDashboardStats = TryCatch(
    async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        let stats;

        if (nodeCache.has("admin-stats"))
            stats = JSON.parse(nodeCache.get("admin-stats") as string);

        else {

            const today = new Date();

            const lastSixMonths = new Date();
            lastSixMonths.setMonth( lastSixMonths.getMonth() -6 );

            const thisMonth = {
                start: new Date(today.getFullYear(), today.getMonth(), 1),
                end: today
            };

            const lastMonth = {
                start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
                end: new Date(today.getFullYear(), today.getMonth(), 0)
            }

            const thisMonthUsersPromise = User.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end
                }
            });

            const lastMonthUsersPromise = User.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end
                }
            });

            const thisMonthProductsPromise = Product.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end
                }
            });

            const lastMonthProductsPromise = Product.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end
                }
            });

            const thisMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: thisMonth.start,
                    $lte: thisMonth.end
                }
            });

            const lastMonthOrdersPromise = Order.find({
                createdAt: {
                    $gte: lastMonth.start,
                    $lte: lastMonth.end
                }
            });

            const lastSixMonthsOrdersPromise = Order.find({
                createdAt: {
                    $gte: lastSixMonths,
                    $lte: today
                }
            });

            const latestTransactionsPromise = Order.find({}).select(
                    ["orderItems", "discount", "total", "status"]
                ).limit(5);

            const [
                thisMonthUsers,
                thisMonthProducts,
                thisMonthOrders,
                lastMonthUsers,
                lastMonthProducts,
                lastMonthOrders,
                usersCount,
                productsCount,
                ordersCount,
                lastSixMonthsOrders,
                categories,
                maleUserCount,
                femaleUserCount,
                lgbtqUserCount,
                latestTransactions

            ] = await Promise.all([
                thisMonthUsersPromise,
                thisMonthProductsPromise,
                thisMonthOrdersPromise,
                lastMonthUsersPromise,
                lastMonthProductsPromise,
                lastMonthOrdersPromise,
                User.countDocuments(),
                Product.countDocuments(),
                Order.find({}).select("total"),
                lastSixMonthsOrdersPromise,
                Product.distinct("category"),
                User.countDocuments({gender: "male"}),
                User.countDocuments({gender: "female"}),
                User.countDocuments({gender: "lgbtq+"}),
                latestTransactionsPromise
            ]);

            const thisMonthRevenue = thisMonthOrders.reduce(
                (total, order) => total + (order.total || 0),
                0
            );

            const lastMonthRevenue = lastMonthOrders.reduce(
                (total, order) => total + (order.total || 0),
                0
            );

            const changePercent = {

                revenue: calculatePercentage(
                    thisMonthRevenue,
                    lastMonthRevenue
                ),

                user: calculatePercentage(
                        thisMonthUsers.length,
                        lastMonthUsers.length
                    ),

                product: calculatePercentage(
                    thisMonthProducts.length,
                    lastMonthProducts.length
                ),

                order: calculatePercentage(
                    thisMonthOrders.length,
                    lastMonthOrders.length
                )
            };

            const revenue = ordersCount.reduce(
                (total, order) => total + (order.total || 0),
                0
            );

            const counts = {
                revenue: revenue,
                user: usersCount,
                product: productsCount,
                order: ordersCount.length
            };

            const orderMonthsCounts = getChartData({
                length: 6,
                today,
                docArr: lastSixMonthsOrders as MyDocument[]
            });

            const orderMonthlyRevenue = getChartData({
                length: 6,
                today,
                docArr: lastSixMonthsOrders as MyDocument[],
                property: "total"
            });

            const categoriesCountPromise = categories.map(
                (category) => Product.countDocuments({ category })
            );

            const categoriesCount = await Promise.all(categoriesCountPromise);

            const categoryStats: Record<string, number>[] = [];

            categories.forEach( (category, i) => {
                categoryStats.push({
                    [category]: Math.round((categoriesCount[i] / productsCount) * 100)
                });
            });

            const userRatio = {
                male: maleUserCount,
                female: femaleUserCount,
                lgbtq: lgbtqUserCount,
                others: usersCount - maleUserCount - femaleUserCount - lgbtqUserCount
            };

            const modifiedTransaction = latestTransactions.map(
                (i) => ({
                    _id: i._id,
                    discount: i.discount,
                    amount: i.total,
                    quantity: i.orderItems.length,
                    status: i.status
                })
            );

            stats = {
                changePercent,
                counts,
                chart: {
                    order: orderMonthsCounts,
                    revenue: orderMonthlyRevenue
                },
                categoryStats,
                userRatio,
                latestTransactions: modifiedTransaction
            };

            nodeCache.set("admin-stats", JSON.stringify(stats));

        }

        return res.status(200).json({
            sucess: true,
            stats
        })
    }
);

export const getPieCharts = TryCatch(
    async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        let charts;

        const key = "admin-pie-charts";

        if(nodeCache.has(key))
            charts = JSON.parse(nodeCache.get(key) as string);

        else {

            const [
                processingOrder,
                shippedOrder,
                otwOrder,
                deliveredOrder,
                cancelledOrder,
                categories,
                productsCount,
                stockOut,
                allOrders,
                allUsers,
                adminUsers,
                customerUsers
            ] = await Promise.all([
                Order.countDocuments({ status: "Processing"}),
                Order.countDocuments({ status: "Shipped"}),
                Order.countDocuments({ status: "On the way"}),
                Order.countDocuments({ status: "Delivered"}),
                Order.countDocuments({ status: "Cancelled"}),
                Product.distinct("category"),
                Product.countDocuments(),
                Product.countDocuments({ stock: 0 }),
                Order.find({}).select([ "total", "discount", "shippingCharges", "tax", "subtotal" ]),
                User.find({}).select(["dob"]),
                User.countDocuments({ role: "admin" }),
                User.countDocuments({ role: "user" })
            ]);

            const orderFullfillment = {
                processing: processingOrder,
                shipped: shippedOrder,
                onTheWay: otwOrder,
                delivered: deliveredOrder,
                cancelledOrder: cancelledOrder
            };

            const categoriesCountPromise = categories.map(
                (category) => Product.countDocuments({ category })
            );

            const categoriesCount = await Promise.all(categoriesCountPromise);

            const categoryStats: Record<string, number>[] = [];

            categories.forEach( (category, i) => {
                categoryStats.push({
                    [category]: Math.round((categoriesCount[i] / productsCount) * 100)
                });
            });

            const stockAvailability = {
                inStock: productsCount - stockOut,
                stockOut
            };

            const grossIncome = allOrders.reduce(
                (prev, order) => prev + (order.total || 0),
                0
            );

            const discounts = allOrders.reduce(
                (prev, order) => prev + (order.discount || 0),
                0
            );

            const productionCost = allOrders.reduce(
                (prev, order) => prev + (order.shippingCharges || 0), 0
            );

            const burnt = allOrders.reduce(
                (prev, order) => prev + (order.tax || 0), 0
            );

            const ads = Math.round(grossIncome * (30 / 100));

            const margin = grossIncome - (discounts + productionCost + burnt + ads);

            const revenueDistribution = {
                productCost: productionCost,
                netMargin: margin,
                discountExpenses: discounts,
                marketingCost: ads,
                loss: burnt

            };

            const userAgeRatio = {
                "18-": allUsers.filter( (i) => i.age < 18).length,
                "18-30": allUsers.filter( (i) => i.age >= 18 && i.age <= 30).length,
                "31-60": allUsers.filter( (i) => i.age > 30 && i.age <= 60).length,
                "60+": allUsers.filter( (i) => i.age > 60).length
            }

            const adminCustomer = {
                admin: adminUsers,
                customer: customerUsers
            }

            charts = {
                orderFullfillment,
                categoryStats,
                stockAvailability,
                revenueDistribution,
                userAgeRatio,
                adminCustomer

            };

            nodeCache.set(key, JSON.stringify(charts));


            return res.status(200).json({
                success: true,
                charts
            })
        }
    }
);

export const getBarCharts = TryCatch(
    async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        let charts;

        const key = "admin-bar-charts";

        if (nodeCache.has(key))
            charts = JSON.parse(nodeCache.get(key) as string);

        else {

            const today = new Date();

            const lastSixMonths = new Date();
            lastSixMonths.setMonth( lastSixMonths.getMonth() - 6 );

            const lastTwelveMonths = new Date();
            lastSixMonths.setMonth( lastTwelveMonths.getMonth() - 12 );

            const sixMonthsProductsPromise = Product.find({
                createdAt: {
                    $gte: lastSixMonths,
                    $lte: today
                }
            }).select("createdAt");

            const sixMonthsUsersPromise = User.find({
                createdAt: {
                    $gte: lastSixMonths,
                    $lte: today
                }
            }).select("createdAt");

            const twelveMonthsOrdersPromise = Order.find({
                createdAt: {
                    $gte: lastTwelveMonths,
                    $lte: today
                }
            }).select("createdAt");

            const [
                products,
                users,
                orders
            ] = await Promise.all([
                sixMonthsProductsPromise,
                sixMonthsUsersPromise,
                twelveMonthsOrdersPromise
            ]);

            const productCounts = getChartData({
                length: 6,
                today,
                docArr: products
            });

            const userCounts = getChartData({
                length: 6,
                today,
                docArr: users
            });

            const orderCounts = getChartData({
                length: 12,
                today,
                docArr: orders as MyDocument[]
            });

            charts = {
                users: userCounts,
                products: productCounts,
                orders: orderCounts
            };

        }

        nodeCache.set(key, JSON.stringify(charts));

        return res.status(200).json({
            success: true,
            charts
        })
    }
);

export const getLineCharts = TryCatch(
    async(
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        let charts;

        const key = "admin-line-charts";

        if (nodeCache.has(key))
            charts = JSON.parse(nodeCache.get(key) as string);

        else {

            const today = new Date();

            const lastTwelveMonths = new Date();
            lastTwelveMonths.setMonth( lastTwelveMonths.getMonth() - 12 );

            const baseQuery = {
                createdAt: {
                    $gte: lastTwelveMonths,
                    $lte: today
                }
            };

            const [products, users, orders] = await Promise.all([
                Product.find(baseQuery).select("createdAt"),
                User.find(baseQuery).select("createdAt"),
                Order.find(baseQuery).select(["createdAt", "discount", "total"])
            ]);

            const productCounts = getChartData({
                length: 12,
                today,
                docArr: products
            });

            const userCounts = getChartData({
                length: 12,
                today,
                docArr: users
            });

            const discounts = getChartData({
                length: 12,
                today,
                docArr: orders as MyDocument[],
                property: "discount"
            });

            const revenue = getChartData({
                length: 12,
                today,
                docArr: orders as MyDocument[],
                property: "total"
            });

            charts = {
                users: userCounts,
                products: productCounts,
                discounts,
                revenue
            };

        }

        nodeCache.set(key, JSON.stringify(charts));

        return res.status(200).json({
            success: true,
            charts
        })
    }

);