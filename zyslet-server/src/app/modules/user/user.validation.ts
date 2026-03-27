import { z } from 'zod';

const createUserZodSchema = z.object({
   body: z.object({
      name: z.string({
         required_error: 'Name is required.',
      }),
      email: z
         .string({
            required_error: 'Email is required',
         })
         .email(),
      password: z.string({
         required_error: 'Password is required',
      }),
      profileImage: z.any().optional(),
   }),
});

const updateUserZodSchema = z.object({
   body: z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      profile_image: z.string().optional(),
   }),
});

export const UserValidation = {
   createUserZodSchema,
   updateUserZodSchema,
};
