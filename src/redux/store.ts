import { configureStore } from "@reduxjs/toolkit";
import { dashboardAPI } from "./api/dashboardApi";
import { orderAPI } from "./api/orderAPI";
import { productAPI } from "./api/productAPI";
import { userAPI } from "./api/userAPI";
import { cartReducer } from "./reducer/cartReducer";
import { userReducer } from "./reducer/userReducer";


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