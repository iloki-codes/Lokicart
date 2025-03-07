import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { MessageResponse, UserResponse } from "../../types/api-types";
import { User } from "../../types/types";
import axios from "axios";


export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ 
        baseUrl: `/api/v1/user/`,
        credentials: "include" 
    }), // localhost/api/v1/user/ - backend url in vite config file
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse, User>({                   // user create - manipulation // .query - get req
            query: (user) => ({
                url: "new",
                method: "POST",
                body: user,
                headers: {
                    "Content-Type": "application/json",
                }
            })
        }) 
    }),
});


export const getUser = async (id: string) => {
    try {
        const { data }: { data: UserResponse} = await axios.get(
            `/api/v1/user/${id}`,
            {
                withCredentials: true
            }
        );
        return data;
    } catch (error) {
        throw error;
    }
};

export const { useLoginMutation } = userAPI;