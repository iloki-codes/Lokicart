import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, MyOrdersResponse, NewOrderRequest, OrderDetailsResponse, ProcessOrderRequest } from "../../types/api-types";


export const orderAPI = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/v1/order"
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
                },
                invalidatesTags: ["orders"]
            })
        }),

        myOrders: builder.query<MyOrdersResponse, string>({
            query: (id) => ({
                url: `my?id=${id}`,
                method: "GET",
                providesTags: ["orders"]
            })
        }),

        getAllOrders: builder.query<MyOrdersResponse, string>({
            query: (id) => ({
                url: `all?id=${id}`,
                method: "GET",
                providesTags: ["orders"]
            })
        }),

        getOrderDetails: builder.query<OrderDetailsResponse, string>({
            query: (id) => ({
                url: "id",
                method: "GET",
                providesTags: ["orders"]
            })
        }),

        processOrder: builder.mutation<MessageResponse, ProcessOrderRequest>({
            query: ({ userId, orderId }) => ({
                url:`${orderId}?id=${userId}`,
                method: "PUT",
                invalidatesTags: ["orders"]
            })
        }),

        deleteOrder: builder.mutation<MessageResponse, ProcessOrderRequest>({
            query: ({ userId, orderId }) => ({
                url:`${orderId}?id=${userId}`,
                method: "DELETE",
                invalidatesTags: ["orders"]
            })
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