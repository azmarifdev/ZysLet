import { z } from 'zod';

const createReviewZodSchema = z.object({
   body: z.object({
      product_id: z.string({
         required_error: 'Product ID is required',
      }),
      name: z.string({
         required_error: 'Name is required',
      }),
      phone: z.string({
         required_error: 'Phone is required',
      }),
      message: z.string().optional(),
      rating: z
         .string({
            required_error: 'Rating is required',
         })
         .min(1, 'Rating must be at least 1')
         .max(5, 'Rating cannot exceed 5')
         .transform(val => Number(val)),
      images: z.array(z.string()).optional(),
   }),
});

const updateReviewStatusZodSchema = z.object({
   body: z.object({
      status: z.enum(['pending', 'approved', 'rejected'], {
         required_error: 'Status is required',
      }),
   }),
});

export const ReviewValidation = {
   createReviewZodSchema,
   updateReviewStatusZodSchema,
};
