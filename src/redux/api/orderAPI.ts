import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, MyOrdersResponse, NewOrderRequest, OrderDetailsResponse, ProcessOrderRequest } from "../../types/api-types";
import { server } from "../serverConfig";


export const orderAPI = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/order`,
        credentials: "include"
    }),

    tagTypes: ["orders"],

    endpoints: (builder) => ({
        newOrder: builder.mutation<MessageResponse, NewOrderRequest>({
            query: (order) => ({
                url: "new",
                method: "POST",
                body: order,
                headers: {
                    "Content-Type": "application/json"
                }
            }),
                invalidatesTags: ["orders"]
        }),

        myOrders: builder.query<MyOrdersResponse, string>({
            query: (id) => `my?id=${id}`,
                providesTags: ["orders"]
        }),

        getAllOrders: builder.query<MyOrdersResponse, string>({
            query: (id) => `all?id=${id}`,
                providesTags: ["orders"]
        }),

        getOrderDetails: builder.query<OrderDetailsResponse, string>({
            query: (id) => id,
                providesTags: ["orders"]
        }),

        processOrder: builder.mutation<MessageResponse, ProcessOrderRequest>({
            query: ({ orderId, userId }) => ({
                url:`${orderId}?id=${userId}`,
                method: "PUT"
            }),
                invalidatesTags: ["orders"]
        }),

        deleteOrder: builder.mutation<MessageResponse, ProcessOrderRequest>({
            query: ({ orderId, userId }) => ({
                url:`${orderId}?id=${userId}`,
                method: "DELETE"
            }),
                invalidatesTags: ["orders"]
        }),

    })
});

export const {
    useNewOrderMutation,
    useProcessOrderMutation,
    useDeleteOrderMutation,
    useMyOrdersQuery,
    useGetAllOrdersQuery,
    useGetOrderDetailsQuery
 } = orderAPI;