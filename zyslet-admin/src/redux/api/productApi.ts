import {api} from "./apiSlice";

const productApiSlices = api.injectEndpoints({
    endpoints: (builder) => ({
        createProduct: builder.mutation<any, any>({
            query: (formData: FormData) => ({
                url: "/api/v1/product/create",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["product"],
        }),
        productLists: builder.query<any, any>({
            query: ({queries}) => ({
                url: "/api/v1/product/list-by-admin",
                params: queries,
            }),
            providesTags: ["product"],
        }),
        productDetails: builder.query<any, any>({
            query: (slug) => ({
                url: `/api/v1/product/details/${slug}`,
            }),
            providesTags: ["product"],
        }),
        togglePublish: builder.mutation<any, string>({
            query: (id) => ({
                url: `/api/v1/product/toggle-publish/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["product"],
        }),
        updateProduct: builder.mutation<any, any>({
            query: (data) => ({
                url: `/api/v1/product/update`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["product"],
        }),
        updateThumbnail: builder.mutation<any, {id: string; data: any}>({
            query: ({id, data}) => ({
                url: `/api/v1/product/thumbnail/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["product"],
        }),
        updateImages: builder.mutation<any, {id: string; data: any}>({
            query: ({id, data}) => ({
                url: `/api/v1/product/images/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["product"],
        }),
        removeImage: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/v1/product/remove-image/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product"],
        }),
        deleteProduct: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/v1/product/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product"],
        }),
        addDescriptionBlock: builder.mutation<any, any>({
            query: (data) => ({
                url: `/api/v1/product/description-block`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["product"],
        }),
        updateDescriptionBlock: builder.mutation<any, any>({
            query: (data) => ({
                url: `/api/v1/product/description-block`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["product"],
        }),
        deleteDescriptionBlock: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/v1/product/description-block/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product"],
        }),
    }),
});

export const {
    useCreateProductMutation,
    useProductListsQuery,
    useProductDetailsQuery,
    useTogglePublishMutation,
    useUpdateProductMutation,
    useUpdateThumbnailMutation,
    useUpdateImagesMutation,
    useRemoveImageMutation,
    useDeleteProductMutation,
    useAddDescriptionBlockMutation,
    useUpdateDescriptionBlockMutation,
    useDeleteDescriptionBlockMutation,
} = productApiSlices;
