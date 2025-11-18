import type {
	CreateTaskRequest,
	FetchTasksParams,
	PagedTasksResponse,
	Task,
	UpdateTaskRequest
} from '@/interfaces';
import { api } from '@/lib/axios';

export const fetchTasks = async (params: FetchTasksParams): Promise<PagedTasksResponse> => {
	const response = await api.get<Task[]>('/tasks', { params });

	response.data.forEach((task) => {
		if (task.dueDate === '0001-01-01T00:00:00') {
			task.dueDate = undefined;
		}
	});

	const metadata = JSON.parse(response.headers['x-pagination']);

	return {
		items: response.data,
		metadata
	};
};

export const fetchTask = async (id: number): Promise<Task> => {
	const response = await api.get<Task>(`/tasks/${id}`);
	if (response.data.dueDate === '0001-01-01T00:00:00') {
		response.data.dueDate = undefined;
	}
	return response.data;
};

export const createTask = async (taskData: CreateTaskRequest): Promise<Task> => {
	const response = await api.post<Task>('/tasks', taskData);
	return response.data;
};

export const updateTask = async ({
	id,
	taskData
}: {
	id: number;
	taskData: UpdateTaskRequest;
}): Promise<void> => {
	await api.put<void>(`/tasks/${id}`, taskData);
};

export const deleteTask = async (id: number): Promise<void> => {
	await api.delete<void>(`/tasks/${id}`);
};
