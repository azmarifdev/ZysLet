import {z} from "zod";

export const productSchema = z.object({
    title: z.string({required_error: "Product title is required"}),
    code: z.string({required_error: "Product code is required"}),
    category: z
        .string({required_error: "Category is required"})
        .min(1, "Category is required"),
    quantity: z.number({required_error: "Quantity is required"}),
    price: z.number({required_error: "Price is required"}),
    is_published: z.boolean({required_error: "Publish status is required"}),
    show_related_products: z.boolean({
        required_error: "Show related products status is required",
    }),
    is_free_shipping: z.boolean({
        required_error: "Free shipping status is required",
    }),
    discount: z
        .number()
        .min(0, {message: "Discount cannot be negative"})
        .max(100, {message: "Discount cannot exceed 100%"})
        .optional(),
    description: z.string().optional(),
    youtube_video: z.string().url().optional(),
    main_features: z.string().optional(),
    important_note: z.string().optional(),
    attributes: z
        .array(
            z.object({
                title: z.string().min(1, "Attribute title is required"),
                values: z
                    .array(z.string().min(1, "Attribute value is required"))
                    .min(1, "At least one value is required"),
            })
        )
        .optional(),

    meta_desc: z.string().optional(),
    meta_keywords: z.array(z.string()).optional(),
    specifications: z
        .array(
            z.object({
                key: z.string().min(1, "Key is required"),
                value: z.string().min(1, "Value is required"),
            })
        )
        .optional(),
    thumbnail_image: z
        .any({required_error: "Thumbnail image is required"})
        .refine((val) => val != null, {
            message: "Thumbnail image is required",
        }),
    product_images: z
        .array(z.any())
        .min(1, "At least one product image is required"),
    description_blocks: z
        .array(
            z.object({
                description: z.string().optional(),
                image: z
                    .any()
                    .refine((file) => file instanceof File, {
                        message: "Image is required",
                    })
                    .optional(),
            })
        )
        .optional(),
});
