import { z } from 'zod';

import { createTaskSchema } from './createTaskSchema';

export const updateTaskSchema = createTaskSchema.extend({
	// isCompleted: z.boolean()
});
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
