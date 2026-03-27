import {useForm, useFieldArray} from "react-hook-form";
import {FaPlus, FaTrash} from "react-icons/fa";
import {z} from "zod";
import {Button} from "@/components/ui/button"; // Assuming you have a Button component
import {useEffect} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {SectionTitle} from "../../add-product/components/section-title";
import toast from "react-hot-toast";
import {useUpdateProductMutation} from "@/redux/api/productApi";

// Define schema for specifications
const specificationSchema = z.object({
    key: z.string().min(1, "Key is required"),
    value: z.string().min(1, "Value is required"),
});

// Type for the form values
type SpecificationFormValues = z.infer<typeof specificationSchema>;

// Define the form schema with specifications array
const specificationsFormSchema = z.object({
    specification: z.array(specificationSchema),
});

type SpecificationsFormValues = z.infer<typeof specificationsFormSchema>;

type props = {
    product: {_id: string; specification: SpecificationFormValues[]}; // Type for product
    onNext?: () => void;
    onPrev?: () => void; // Optional prop for previous button
};

export function SpecificationsSection({product, onNext, onPrev}: props) {
    // Initialize form with useForm for specifications
    const form = useForm<SpecificationsFormValues>({
        resolver: zodResolver(specificationsFormSchema),
        mode: "onChange",
        defaultValues: {
            specification:
                product.specification?.map((spec) => ({
                    key: spec.key,
                    value: spec.value,
                })) || [], // Initialize with existing specifications
        },
    });

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
    } = form;

    const {
        fields: specificationFields,
        append: appendSpecification,
        remove: removeSpecification,
    } = useFieldArray({
        control,
        name: "specification", // Array name for specifications
    });

    useEffect(() => {
        // Reset form when the product or specifications change
        form.reset({
            specification: product.specification || [],
        });
    }, [product, form]);

    const [updateProduct, {isLoading}] = useUpdateProductMutation();

    const onSubmit = async (data: SpecificationsFormValues) => {
        const updatedData = {
            specification: data.specification,
            id: product?._id, // Re-enable the id field
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
        <section className="bg-white p-6 rounded-lg shadow-sm border-2 border-gray-200">
            <div className="flex justify-between items-center mb-4">
                <SectionTitle title="Specifications" />
                <button
                    type="button"
                    onClick={() => appendSpecification({key: "", value: ""})}
                    className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-1 px-3 rounded-md transition-colors">
                    <FaPlus size={12} className="mr-1" /> Add Specification
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    {specificationFields.map((field, index) => (
                        <div
                            key={field.id}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                            <div>
                                <label className="block text-gray-700 mb-1.5">
                                    Key
                                </label>
                                <input
                                    {...register(`specification.${index}.key`)}
                                    className="border border-slate-400 rounded-lg focus:outline-primary text-gray-700 w-full px-4 h-11 bg-white"
                                    placeholder="Specification key"
                                />
                                {errors.specification?.[index]?.key && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {
                                            errors.specification[index]?.key
                                                ?.message
                                        }
                                    </p>
                                )}
                            </div>
                            <div className="relative">
                                <label className="block text-gray-700 mb-1.5">
                                    Value
                                </label>
                                <input
                                    {...register(
                                        `specification.${index}.value`
                                    )}
                                    className="border border-slate-400 rounded-lg focus:outline-primary text-gray-700 w-full px-4 h-11 bg-white"
                                    placeholder="Specification value"
                                />
                                {errors.specification?.[index]?.value && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {
                                            errors.specification[index]?.value
                                                ?.message
                                        }
                                    </p>
                                )}
                                {index >= 0 && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeSpecification(index)
                                        }
                                        className="absolute -top-2 -right-2 bg-red-100 text-red-500 hover:text-red-700 p-1 rounded-full">
                                        <FaTrash size={12} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
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
                    {onNext && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onNext}
                            className="px-6 py-2 border-primary !text-primary">
                            Next
                        </Button>
                    )}
                </div>
            </form>
        </section>
    );
}
