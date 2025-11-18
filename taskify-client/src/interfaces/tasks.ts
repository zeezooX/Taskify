export interface Task {
	id: number;
	title: string;
	description?: string;
	dueDate?: string;
	completed: boolean;
}

export interface FetchTasksParams {
	pageNumber: number;
	pageSize: number;
	isCompleted?: boolean;
	sortBy?: 'dueDate' | 'title';
	isDescending?: boolean;
}

export interface PagedTasksResponse {
	items: Task[];
	metadata: {
		TotalCount: number;
		TotalPages: number;
		CurrentPage: number;
		PageSize: number;
		HasNext: boolean;
		HasPrevious: boolean;
	};
}

export interface CreateTaskRequest {
	title: string;
	description?: string;
	dueDate?: string;
}

export interface UpdateTaskRequest {
	title?: string;
	description?: string;
	dueDate?: string;
	completed?: boolean;
}
