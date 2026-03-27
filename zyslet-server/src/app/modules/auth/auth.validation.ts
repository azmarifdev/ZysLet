import { z } from 'zod';

const createLoginZodSchema = z.object({
   body: z.object({
      email: z.string({
         required_error: 'Email is required.',
      }),
      password: z.string({
         required_error: 'Password is required.',
      }),
   }),
});
const createRefreshTokenZodSchema = z.object({
   cookies: z.object({
      refreshToken: z.string(),
   }),
});

const changePasswordZodSchema = z.object({
   body: z.object({
      oldPassword: z.string({
         required_error: 'Old password is required',
      }),
      newPassword: z.string({
         required_error: 'New password is required',
      }),
   }),
});

export const AuthValidation = {
   createLoginZodSchema,
   createRefreshTokenZodSchema,
   changePasswordZodSchema,
};
