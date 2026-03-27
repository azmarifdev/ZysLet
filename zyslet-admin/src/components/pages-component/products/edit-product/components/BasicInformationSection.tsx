import {FormProvider, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useCategoryListQuery} from "@/redux/api/categoryApi";
import FormInput from "@/components/reusable/form/FormInputHF";
import {Button} from "@/components/ui/button";
import {SectionTitle} from "../../add-product/components/section-title";
import {useEffect, useState} from "react";
import {z} from "zod";
import {
    useProductListsQuery,
    useUpdateProductMutation,
} from "@/redux/api/productApi";
import toast from "react-hot-toast";
import CustomSearchSelect from "@/components/reusable/form/CustomSearchSelect";
import {useDebounce} from "@/hooks/useDebounce";

const productFormSchema = z.object({
    title: z.string().min(1, "Title is required"),
    code: z.string().min(1, "Code is required"),
    category: z.string().min(1, "Category is required"),
    quantity: z.number().min(0),
    price: z.number().min(0),
    discount: z.number().min(0).max(100).optional(),
    is_free_shipping: z.boolean().optional(),
    show_related_products: z.boolean().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export function BasicInformationSection({
    onNext,
    product,
}: {
    onNext?: () => void;
    product?: any;
}) {
    const {data: categories} = useCategoryListQuery();

    // For search functionality
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 300);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        mode: "onChange",
    });

    const {
        register,
        handleSubmit,
        formState: {errors, isValid},
        reset,
    } = form;

    const [bundleProducts, setBundleProducts] = useState<any[]>([]);

    // Get product bundle products for search
    const {data: bundleProductsData} = useProductListsQuery({
        queries: `search=${debouncedSearchTerm}`,
    });

    const bundleProductsOptions =
        bundleProductsData?.data
            ?.filter((prod: any) => prod?.id !== product?._id)
            ?.map((pd: any) => ({
                value: pd?.id,
                label: pd?.title,
            })) || [];

    useEffect(() => {
        const formattedBundleProducts =
            product.bundle_products?.map((bundleProduct: any) => ({
                value: bundleProduct._id || bundleProduct.id,
                label: bundleProduct.title,
            })) || [];
        if (Array.isArray(formattedBundleProducts)) {
            setBundleProducts(formattedBundleProducts);
        }
    }, [product.bundle_products]);

    useEffect(() => {
        if (product && categories?.data?.length) {
            // Convert the product's bundle_products to the format expected by CustomSearchSelect

            reset({
                title: product.title,
                code: product.code,
                category: product.category?._id, // must match one of the <option value="">
                quantity: product.quantity,
                price: product.price,
                discount: product.discount,
                is_free_shipping: product.is_free_shipping,
                show_related_products: product.show_related_products,
            });
        }
    }, [product, categories, reset]);

    const [updateProduct, {isLoading}] = useUpdateProductMutation();

    const onSubmit = async (data: ProductFormValues) => {
        const updatedData = {
            ...data,
            id: product?._id,
            bundle_products: bundleProducts?.map(
                (product: any) => product.value
            ),
        };
        const response = await updateProduct(updatedData).unwrap();

        if (response?.success) {
            toast.success("Product updated successfully");
        } else {
            toast.error("Failed to update product");
            console.error("Failed to update product", response?.message);
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <section className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
                    <SectionTitle title="Basic Information" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormInput
                            name="title"
                            label="Product Title"
                            placeholder="Enter product title"
                            required
                        />
                        <FormInput
                            name="code"
                            label="Product Code"
                            disabled
                            placeholder="Enter product code"
                            required
                        />

                        <div>
                            <label
                                htmlFor="category"
                                className="block text-gray-700 mb-1.5">
                                Category
                            </label>
                            <select
                                id="category"
                                className="border border-slate-400 rounded-lg focus:outline-primary text-gray-700 w-full px-4 h-11 bg-transparent"
                                {...register("category")}>
                                <option value="">Select a category</option>
                                {categories?.data?.map((category: any) => (
                                    <option
                                        key={category._id}
                                        value={category._id}>
                                        {category.title}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.category.message?.toString()}
                                </p>
                            )}
                        </div>

                        <FormInput
                            name="quantity"
                            label="Quantity"
                            type="number"
                            placeholder="Enter quantity"
                            required
                        />
                        <FormInput
                            name="price"
                            label="Price"
                            type="number"
                            placeholder="Enter price"
                            required
                        />
                        <FormInput
                            name="discount"
                            label="Discount Percentage"
                            type="number"
                            placeholder="Enter discount %"
                        />

                        <div className="flex items-center space-x-2">
                            <input
                                id="is_free_shipping"
                                type="checkbox"
                                {...register("is_free_shipping")}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="is_free_shipping"
                                className="text-gray-700">
                                Free Shipping available
                            </label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                id="show_related_products"
                                type="checkbox"
                                {...register("show_related_products")}
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label
                                htmlFor="show_related_products"
                                className="text-gray-700">
                                Show related products
                            </label>
                        </div>

                        <div className="col-span-2">
                            <CustomSearchSelect
                                name="bundle_products"
                                label="Bundle Products (free shipping)"
                                options={bundleProductsOptions}
                                searchable
                                isMulti
                                defaultValue={bundleProducts}
                                onChange={(value: any) => {
                                    setBundleProducts(value);
                                }}
                                onSearch={(value) => {
                                    setSearchTerm(value);
                                }}
                                placeholder="Search and select products for bundle"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="px-6 py-2">
                            {isLoading ? "Updating..." : "Update"}
                        </Button>
                        {onNext && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onNext}
                                className="px-6 py-2 border-primary !text-primary"
                                disabled={!isValid}>
                                Next
                            </Button>
                        )}
                    </div>
                </section>
            </form>
        </FormProvider>
    );
}
