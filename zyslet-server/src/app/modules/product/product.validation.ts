import { z } from 'zod';

const createProductSchema = z.object({
   body: z.object({
      title: z.string({ required_error: 'Title is required' }),
      desc: z.string().optional(),
      man_features: z.array(z.string()).optional(),
      specification: z.array(z.string()).optional(),
      important_note: z.string().optional(),
      code: z.string({ required_error: 'Code is required' }),
      category: z.string({ required_error: 'Category is required' }),
      discount: z.string().optional(),
      price: z.string({ required_error: 'Price is required' }),
      quantity: z.string().default('1'),
      meta_desc: z.string().optional(),
      meta_keywords: z.array(z.string()).optional(),
      is_published: z.enum(['true', 'false']).optional(),
      is_free_shipping: z.enum(['true', 'false']).optional(),
      show_related_products: z.enum(['true', 'false']).optional(),
      youtube_video: z.string().optional(),
   }),
});

const updateProductSchema = z.object({
   body: z.object({
      id: z.string({ required_error: 'ID is required' }),
      title: z.string().optional(),
      category: z.string().optional(),
      discount: z.number().optional(),
      price: z.number().optional(),
      quantity: z.number().optional(),
      desc: z.string().optional(),
      main_features: z.string().optional(),
      important_note: z.string().optional(),
      attribute: z
         .object({
            title: z.string(),
            values: z.array(z.string()),
         })
         .optional(),
      specification: z
         .array(
            z.object({
               key: z.string(),
               value: z.string(),
            })
         )
         .optional(),
      meta_desc: z.string().optional(),
      meta_keywords: z.array(z.string()).optional(),
      is_published: z.boolean().optional(),
      is_free_shipping: z.boolean().optional(),
      show_related_products: z.boolean().optional(),
      youtube_video: z.string().optional(),
   }),
});

export const ProductValidation = {
   createProductSchema,
   updateProductSchema,
};
