import { z } from 'zod';

export const createTaskSchema = z.object({
	title: z.string().nonempty('Title is required.').max(100, 'Title cannot exceed 100 characters.'),
	description: z.string().max(500, 'Description cannot exceed 500 characters.').optional(),
	dueDate: z
		.date()
		.optional()
		.refine((date) => date === undefined || date.getTime() > Date.now(), {
			message: 'Due date must be in the future.'
		})
});

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
