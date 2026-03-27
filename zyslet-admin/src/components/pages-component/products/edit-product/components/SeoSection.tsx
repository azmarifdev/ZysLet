import {useEffect, useState, KeyboardEvent} from "react";
import {useForm, FormProvider} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {FaTimes} from "react-icons/fa";

import {Button} from "@/components/ui/button";

import {z} from "zod";
import {SectionTitle} from "../../add-product/components/section-title";
import {useUpdateProductMutation} from "@/redux/api/productApi";
import toast from "react-hot-toast";

export const productFormSchema = z.object({
    // other fields...
    meta_desc: z.string().optional(),
    meta_keywords: z.array(z.string()).optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export function SEOInformationSectionWrapper({
    product,
    onPrev,
}: {
    product?: any;
    onPrev?: () => void;
}) {
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productFormSchema),
        mode: "onChange",
    });

    const [metaKeywordInput, setMetaKeywordInput] = useState("");
    const [metaKeywords, setMetaKeywords] = useState<string[]>([]);

    useEffect(() => {
        if (product) {
            form.reset({
                meta_desc: product.meta_desc || "",
                meta_keywords: product.meta_keywords || [],
            });
            setMetaKeywords(product.meta_keywords || []);
        }
    }, [product, form]);

    const handleMetaKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && metaKeywordInput.trim()) {
            e.preventDefault();
            if (!metaKeywords.includes(metaKeywordInput.trim())) {
                setMetaKeywords((prev) => [...prev, metaKeywordInput.trim()]);
                setMetaKeywordInput("");
            }
        }
    };

    const removeMetaKeyword = (index: number) => {
        setMetaKeywords((prev) => prev.filter((_, idx) => idx !== index));
    };

    const [updateProduct, {isLoading}] = useUpdateProductMutation();

    const onSubmit = async (data: ProductFormValues) => {
        const updatedData = {
            ...data,
            id: product?._id,
            meta_keywords: metaKeywords,
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
                    <SectionTitle title="SEO Information" />
                    <div className="space-y-6">
                        <div>
                            <label
                                htmlFor="meta_desc"
                                className="block text-gray-700 mb-1.5">
                                Meta Description
                            </label>
                            <textarea
                                id="meta_desc"
                                className="border border-slate-400 rounded-lg focus:outline-primary text-gray-700 w-full px-4 bg-transparent py-2"
                                placeholder="Enter meta description"
                                rows={3}
                                {...form.register("meta_desc")}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="meta_keywords"
                                className="block text-gray-700 mb-1.5">
                                Meta Keywords (press Enter to add)
                            </label>
                            <input
                                id="meta_keywords"
                                className="border border-slate-400 rounded-lg focus:outline-primary text-gray-700 w-full px-4 h-11 bg-transparent"
                                placeholder="Type and press Enter to add"
                                value={metaKeywordInput}
                                onChange={(e) =>
                                    setMetaKeywordInput(e.target.value)
                                }
                                onKeyDown={handleMetaKeywordKeyDown}
                            />
                            {metaKeywords.length > 0 && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                                    <div className="flex flex-wrap gap-2">
                                        {metaKeywords.map((keyword, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm">
                                                <span className="text-sm">
                                                    {keyword}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeMetaKeyword(index)
                                                    }
                                                    className="ml-2 text-red-500 hover:text-red-700">
                                                    <FaTimes size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 mt-8">
                        {onPrev && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onPrev}
                                className="px-6 py-2 border-primary !text-primary">
                                Prev
                            </Button>
                        )}
                        <Button
                            disabled={isLoading}
                            type="submit"
                            className="px-6 py-2">
                            {isLoading ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </section>
            </form>
        </FormProvider>
    );
}
