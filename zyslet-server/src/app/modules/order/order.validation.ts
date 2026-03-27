import { z } from 'zod';

const createOrderZodSchema = z.object({
   body: z.object({
      delivery_charge: z
         .number({
            required_error: 'Delivery charge is required',
         })
         .min(0, 'Delivery charge cannot be negative'),
      subtotal: z
         .number({
            required_error: 'Subtotal is required',
         })
         .min(0, 'Subtotal cannot be negative'),
      total_price: z
         .number({
            required_error: 'Total price is required',
         })
         .min(0, 'Total price cannot be negative'),
      address: z.object({
         name: z.string({
            required_error: 'Name is required',
         }),
         phone: z.string({
            required_error: 'Phone is required',
         }),
         address: z.string({
            required_error: 'Address is required',
         }),
      }),

      order_items: z
         .array(
            z.object({
               productId: z.string({
                  required_error: 'Product ID is required',
               }),
               quantity: z
                  .number({
                     required_error: 'Quantity is required',
                  })
                  .min(1, 'Quantity must be at least 1'),
               attributes: z
                  .array(
                     z.object({
                        title: z.string({
                           required_error: 'Title is required',
                        }),
                        value: z.string({
                           required_error: 'Value is required',
                        }),
                     })
                  )
                  .optional(),
               price: z
                  .number({
                     required_error: 'Price is required',
                  })
                  .min(0, 'Price cannot be negative'),
               discount_price: z.number().optional(),
               selling_price: z
                  .number({
                     required_error: 'Selling price is required',
                  })
                  .min(0, 'Selling price cannot be negative'),
               subtotal: z
                  .number({
                     required_error: 'Subtotal is required',
                  })
                  .min(0, 'Subtotal cannot be negative'),
            })
         )
         .nonempty('At least one order item is required'),
   }),
});

const updateOrderStatusZodSchema = z.object({
   body: z.object({
      status: z.enum(
         ['pending', 'processing', 'completed', 'cancelled', 'returned'],
         {
            required_error: 'Status is required',
         }
      ),
   }),
});

export const OrderValidation = {
   createOrderZodSchema,
   updateOrderStatusZodSchema,
};
