import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { FetchTasksParams } from '@/interfaces';
import { createTask, deleteTask, fetchTask, fetchTasks, updateTask } from '@/queries';

export const taskKeys = {
	all: ['tasks'] as const,
	lists: () => [...taskKeys.all, 'list'] as const,
	list: (params: FetchTasksParams) => [...taskKeys.lists(), params] as const,
	details: () => [...taskKeys.all, 'detail'] as const,
	detail: (id: number) => [...taskKeys.details(), id] as const
};

export const useTasks = (params: FetchTasksParams) => {
	return useQuery({
		queryKey: taskKeys.list(params),
		queryFn: () => fetchTasks(params),
		placeholderData: keepPreviousData
	});
};

export const useTask = (id: number, enabled = true) => {
	return useQuery({
		queryKey: taskKeys.detail(id),
		queryFn: () => fetchTask(id),
		enabled: enabled && !!id
	});
};

export const useCreateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
			toast.success('Task created successfully!');
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || error?.message || 'Failed to create task';
			toast.error(message);
		}
	});
};

export const useUpdateTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: updateTask,
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
			queryClient.invalidateQueries({ queryKey: taskKeys.detail(variables.id) });
			toast.success('Task updated successfully!');
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || error?.message || 'Failed to update task';
			toast.error(message);
		}
	});
};

export const useDeleteTask = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteTask,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
			toast.success('Task deleted successfully!');
		},
		onError: (error: any) => {
			const message = error?.response?.data?.message || error?.message || 'Failed to delete task';
			toast.error(message);
		}
	});
};
