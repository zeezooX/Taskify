import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email().nonempty('Email is required.'),
	password: z
		.string()
		.nonempty('Password is required.')
		.min(6, 'Password must be at least 6 characters long.')
});

export type LoginFormData = z.infer<typeof loginSchema>;
