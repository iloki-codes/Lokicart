import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AllProductsResponse, DeleteProductRequest, getCategoriesResponse, MessageResponse, NewProductRequest, ProductResponse, SearchProductRequest, SearchProductResponse, UpdateProductRequest } from "../../types/api-types";
import { server } from "../serverConfig";
// import { Product } from "../../types/types";
// import axios from "axios";


export const productAPI = createApi({
    reducerPath: "productApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/product/`,
        credentials: "include"
    }),

    tagTypes: ["product"],

    endpoints: (builder) => ({

        trendingProducts: builder.query<AllProductsResponse, string>({
            query: () => ({
                url: "trending",
                method: "GET"
            }),
            providesTags: ["product"]
        }),

        getAllProducts: builder.query<AllProductsResponse, string>({
            query: (id) => ({
                url: `all?id=${id}`,
                method: "GET"
            }),
            providesTags: ["product"]
        }),

        searchProduct: builder.query<SearchProductResponse, SearchProductRequest>({
            query: ({ price, search, sort, category, page }) => {
                let base =`search?search=${search}&page=${page}`;

                if (price) base += `&price=${price}`;
                if (sort) base += `&sort=${sort}`;
                if (category) base += `&category=${category}`;
                // if (limit) base+= `&limit=${limit}`;
                return base;
            },
            providesTags: ["product"]
        }),

        newProduct: builder.mutation<MessageResponse, NewProductRequest>({
            query: ({ formData, id }) => ({
                url: `new?id=${id}`,
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["product"]
        }),

        getCategories: builder.query<getCategoriesResponse, string>({
            query: () => ({
                url: "categories",
                method: "GET"
            }),
            providesTags: ["product"]
        }),

        getProduct: builder.query<ProductResponse, string>({
            query: (id) => id,
            providesTags: ["product"]
        }),

        updateProduct: builder.mutation<MessageResponse, UpdateProductRequest>({
            query: ({ formData, userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["product"]
        }),

        deleteProduct: builder.mutation<MessageResponse, DeleteProductRequest>({
            query: ({ userId, productId }) => ({
                url: `${productId}?id=${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["product"]
        })
    })
});

export const {
    useTrendingProductsQuery,
    useGetAllProductsQuery,
    useGetCategoriesQuery,
    useSearchProductQuery,
    useNewProductMutation,
    useGetProductQuery,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productAPI;


// newProduct,
//         trendingProducts,
//         searchProduct,
//         getAllProducts,
//         getCategories,
//         getProduct,
//         updateProduct,
//         deleteProduct