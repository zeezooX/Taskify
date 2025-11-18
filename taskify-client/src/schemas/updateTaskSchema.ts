import { z } from 'zod';

import { createTaskSchema } from './createTaskSchema';

export const updateTaskSchema = createTaskSchema.extend({});
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
