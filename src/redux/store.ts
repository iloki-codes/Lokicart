import { configureStore } from "@reduxjs/toolkit";
import { productAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import { userReducer } from "./reducer/userReducer";
import { cartReducer } from "./reducer/cartReducer";
import { orderAPI } from "./api/orderAPI";
import { dashboardAPI } from "./api/dashboardApi";


export const server = import.meta.env.VITE_SERVER_API;

export const store = configureStore({
    reducer: {
        [userAPI.reducerPath]: userAPI.reducer,
        [productAPI.reducerPath]: productAPI.reducer,
        [orderAPI.reducerPath]: orderAPI.reducer,
        [userReducer.name]: userReducer.reducer,
        [cartReducer.name]: cartReducer.reducer,
        [dashboardAPI.reducerPath]: dashboardAPI.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(
        userAPI.middleware,
        productAPI.middleware,
        orderAPI.middleware,
        dashboardAPI.middleware
    ),
    // middleware: (mid) => [...mid(), userAPI.middleware, productAPI.middleware],
});

export type RootState = ReturnType<typeof store.getState>; // to return the current store state