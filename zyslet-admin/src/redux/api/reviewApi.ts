import {api} from "./apiSlice";

export const reviewApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // Get reviews with filtering, pagination and search
        getReviews: builder.query<any, {query: string}>({
            query: ({query}) => ({
                url: `/api/v1/review/lists?${query}`,
            }),
            providesTags: ["reviews"],
        }),

        // Approve a review
        approveReview: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/v1/review/status/${id}`,
                method: "PATCH",
                body: {status: "approved"},
            }),
            invalidatesTags: ["reviews"],
        }),

        // Reject a review
        rejectReview: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/v1/review/status/${id}`,
                method: "PATCH",
                body: {status: "rejected"},
            }),
            invalidatesTags: ["reviews"],
        }),

        // Delete a review
        deleteReview: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/v1/review/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["reviews"],
        }),
        togglePublish: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/v1/review/toggle-publish/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["reviews"],
        }),
    }),
});

export const {
    useGetReviewsQuery,
    useApproveReviewMutation,
    useRejectReviewMutation,
    useDeleteReviewMutation,
    useTogglePublishMutation,
} = reviewApi;
