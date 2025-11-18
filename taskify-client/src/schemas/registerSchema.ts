import { z } from 'zod';

import { loginSchema } from './loginSchema';

export const registerSchema = loginSchema
	.extend({
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword']
	});

export type RegisterFormData = z.infer<typeof registerSchema>;
