import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, 'Min 3 characters').max(50),
  fullName: z.string().min(1, 'Full name is required').max(100),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
