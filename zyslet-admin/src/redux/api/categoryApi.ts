import {api} from "./apiSlice";

interface Category {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string;
}

interface CategoryResponse {
    success: boolean;
    message: string;
    data: Category[];
}

interface SingleCategoryResponse {
    success: boolean;
    message: string;
    data: Category;
}

interface CategoryPayload {
    title: string;
}

const categoryApiSlices = api.injectEndpoints({
    endpoints: (builder) => ({
        categoryList: builder.query<CategoryResponse, void>({
            query: () => ({
                url: "/api/v1/categories",
            }),
            providesTags: ["category"],
        }),

        getCategoryById: builder.query<SingleCategoryResponse, string>({
            query: (id) => ({
                url: `/api/v1/categories/${id}`,
            }),
            providesTags: ["category"],
        }),

        addCategory: builder.mutation<SingleCategoryResponse, CategoryPayload>({
            query: (data) => ({
                url: "/api/v1/categories/create",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["category"],
        }),

        updateCategory: builder.mutation<
            SingleCategoryResponse,
            {id: string; data: CategoryPayload}
        >({
            query: ({id, data}) => ({
                url: `/api/v1/categories/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["category"],
        }),

        deleteCategory: builder.mutation<
            {success: boolean; message: string},
            string
        >({
            query: (id) => ({
                url: `/api/v1/categories/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["category"],
        }),
    }),
});

export const {
    useCategoryListQuery,
    useGetCategoryByIdQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApiSlices;
