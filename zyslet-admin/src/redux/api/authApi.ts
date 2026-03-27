import {api} from "./apiSlice";

export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        loadUser: builder.query<any, any>({
            query: () => ({
                url: "/api/v1/user/me",
            }),
            providesTags: ["users"],
        }),
        loginUser: builder.mutation<any, any>({
            query: (data) => ({
                url: "/api/v1/auth/login",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["users"],
        }),
        logout: builder.mutation<any, any>({
            query: () => ({
                url: "/api/v1/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["users"],
        }),
        changePassword: builder.mutation<any, any>({
            query: (data) => ({
                url: "/api/v1/auth/change-password",
                method: "POST",
                body: data,
            }),
        }),
        updateUser: builder.mutation<any, any>({
            query: (data) => ({
                url: "/api/v1/user",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["users"],
        }),
    }),
});

export const {
    useLoadUserQuery,
    useLogoutMutation,
    useLoginUserMutation,
    useChangePasswordMutation,
    useUpdateUserMutation,
} = authApi;
