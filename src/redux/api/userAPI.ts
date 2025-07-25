import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { AllUsersResponse, DeleteUserRequest, MessageResponse, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";
import { server } from "../serverConfig";


export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${server}/api/v1/user/`,
        mode: "cors",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    }),                                                         // localhost/api/v1/user/ - backend url in vite config file
    tagTypes: ["users"],
    endpoints: (builder) => ({

        login: builder.mutation<MessageResponse, User>({                   // user create - manipulation // .query - get req
            query: (user) => ({
                url: "new",
                method: "POST",
                body: user,
                headers: {
                    "Content-Type": "application/json",
                }
            }),
            invalidatesTags: ["users"],
        }),

        deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({                   // user create - manipulation // .query - get req
            query: ({userId, adminUserId}) => ({
                url: `${userId}?id=${adminUserId}`,
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                }
            }),
            invalidatesTags: ["users"],
        }),

        allUsers: builder.query<AllUsersResponse, string>({
            query: (id) => `all?id=${id}`,
            providesTags: ["users"]
        })
    }),
});


export const getUser = async (id: string) => {
    try {
        const { data }: { data: UserResponse} = await axios.get(
            `${server}/api/v1/user/${id}`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const { useLoginMutation, useAllUsersQuery, useDeleteUserMutation } = userAPI;
